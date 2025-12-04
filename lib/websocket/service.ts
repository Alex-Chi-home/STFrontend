"use client";

import { io, Socket } from "socket.io-client";
import {
  ConnectionStatus,
  ClientEvents,
  ServerEvents,
  TypingPayload,
  MessageReadPayload,
  ServerToClientEvents,
  ClientToServerEvents,
} from "./types";

type EventCallback = (...args: unknown[]) => void;

const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:5555";

// Check if debug mode is enabled
const isDebugEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  const urlParams = new URLSearchParams(window.location.search);
  return (
    localStorage.getItem("ws_debug") === "true" ||
    urlParams.get("ws_debug") === "true" ||
    process.env.NODE_ENV === "development"
  );
};

// Logger - always log errors, other logs only in debug mode
const wsLog = (message: string, data?: unknown) => {
  if (!isDebugEnabled()) return;
  const ts = new Date().toISOString().slice(11, 23);
  // eslint-disable-next-line no-console
  console.log(`[WS ${ts}] ${message}`, data ?? "");
};

const wsError = (message: string, error?: unknown) => {
  const ts = new Date().toISOString().slice(11, 23);
  console.error(`[WS ${ts}] ❌ ${message}`, error ?? "");
};

class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private _status: ConnectionStatus = "disconnected";
  private joinedChats: Set<number> = new Set();
  private typingTimeouts: Map<number, NodeJS.Timeout> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  get status(): ConnectionStatus {
    return this._status;
  }

  private setStatus(status: ConnectionStatus): void {
    this._status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }

  public onStatusChange(
    callback: (status: ConnectionStatus) => void
  ): () => void {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  public connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.setStatus("connecting");

    this.socket = io(WEBSOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    this.setupConnectionEvents();
    this.setupServerEvents();
  }

  private setupConnectionEvents(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.setStatus("connected");
      this.joinedChats.forEach((chatId) => {
        this.socket?.emit(ClientEvents.JOIN_CHAT, chatId);
      });
    });

    this.socket.on("disconnect", (reason) => {
      wsError(`Disconnected: ${reason}`);
      this.setStatus("disconnected");
    });

    this.socket.io.on("reconnect_attempt", () => {
      this.setStatus("reconnecting");
    });

    this.socket.io.on("reconnect", () => {
      wsLog("✅ Reconnected");
      this.setStatus("connected");
    });

    this.socket.on("connect_error", (error) => {
      wsError("Connection error", {
        message: error.message,
        cause: error.cause,
      });
      this.setStatus("disconnected");
    });
  }

  private setupServerEvents(): void {
    if (!this.socket) return;

    Object.values(ServerEvents).forEach((event) => {
      this.socket?.on(event as keyof ServerToClientEvents, (data: unknown) => {
        this.emit(event, data);
      });
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.joinedChats.clear();
    this.typingTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.typingTimeouts.clear();
    this.setStatus("disconnected");
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => this.off(event, callback);
  }

  public off(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        wsError(`Error in listener for ${event}`, error);
      }
    });
  }

  public joinChat(chatId: number): void {
    if (!this.socket?.connected) {
      return;
    }
    if (this.joinedChats.has(chatId)) {
      return;
    }
    this.socket.emit(ClientEvents.JOIN_CHAT, chatId);
    this.joinedChats.add(chatId);
  }

  public leaveChat(chatId: number): void {
    if (!this.socket?.connected) return;
    if (!this.joinedChats.has(chatId)) return;

    this.socket.emit(ClientEvents.LEAVE_CHAT, chatId);
    this.joinedChats.delete(chatId);
    this.stopTyping(chatId);
  }

  public startTyping(chatId: number): void {
    if (!this.socket?.connected) return;

    const existingTimeout = this.typingTimeouts.get(chatId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    } else {
      const payload: TypingPayload = { chatId };
      this.socket.emit(ClientEvents.TYPING_START, payload);
    }

    const timeout = setTimeout(() => {
      this.stopTyping(chatId);
    }, 3000);
    this.typingTimeouts.set(chatId, timeout);
  }

  public stopTyping(chatId: number): void {
    const timeout = this.typingTimeouts.get(chatId);
    if (timeout) {
      clearTimeout(timeout);
      this.typingTimeouts.delete(chatId);

      if (this.socket?.connected) {
        const payload: TypingPayload = { chatId };
        this.socket.emit(ClientEvents.TYPING_STOP, payload);
      }
    }
  }

  public markMessageRead(messageId: number, chatId: number): void {
    if (!this.socket?.connected) return;

    const payload: MessageReadPayload = { messageId, chatId };
    this.socket.emit(ClientEvents.MESSAGE_READ, payload);
  }

  public getSocket(): Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null {
    return this.socket;
  }
}

export const websocketService = WebSocketService.getInstance();

export { WebSocketService };
