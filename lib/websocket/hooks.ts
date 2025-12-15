"use client";

import { useEffect, useCallback, useRef } from "react";
import { websocketService } from "./service";
import { useWebSocketStore } from "./store";
import { ServerEvents, ConnectionStatus } from "./types";
import { Chat, Message } from "../types";

export function useWebSocketConnection(token: string | null) {
  const { status, setStatus } = useWebSocketStore();
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      if (hasConnectedRef.current) {
        websocketService.disconnect();
        hasConnectedRef.current = false;
      }
      return;
    }

    const unsubscribe = websocketService.onStatusChange(
      (newStatus: ConnectionStatus) => {
        setStatus(newStatus);
      }
    );

    websocketService.connect(token);
    hasConnectedRef.current = true;

    return () => {
      unsubscribe();
    };
  }, [token, setStatus]);

  useEffect(() => {
    return () => {
      if (hasConnectedRef.current) {
        websocketService.disconnect();
      }
    };
  }, []);

  return {
    status,
    isConnected: status === "connected",
    isConnecting: status === "connecting",
    isReconnecting: status === "reconnecting",
    disconnect: () => websocketService.disconnect(),
    reconnect: () => token && websocketService.connect(token),
  };
}

export function useChatRoom() {}

export function useMessageEvents(
  onNewMessage?: (message: Message) => void,
  onMessageDeleted?: (payload: { chatId: number; messageId: number }) => void
) {
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (onNewMessage) {
      unsubscribers.push(
        websocketService.on(
          ServerEvents.MESSAGE_NEW,
          onNewMessage as () => void
        )
      );
    }

    if (onMessageDeleted) {
      unsubscribers.push(
        websocketService.on(
          ServerEvents.MESSAGE_DELETED,
          onMessageDeleted as () => void
        )
      );
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [onNewMessage, onMessageDeleted]);
}

export function useChatEvents(
  onNewChat?: (chat: Chat) => void,
  onChatDeleted?: (payload: { chatId: number }) => void
) {
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (onNewChat) {
      unsubscribers.push(
        websocketService.on(ServerEvents.CHAT_NEW, onNewChat as () => void)
      );
    }

    if (onChatDeleted) {
      unsubscribers.push(
        websocketService.on(
          ServerEvents.CHAT_DELETED,
          onChatDeleted as () => void
        )
      );
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [onNewChat, onChatDeleted]);
}

export function useMessageReadStatus() {
  const markAsRead = useCallback((messageId: number, chatId: number) => {
    websocketService.markMessageRead(messageId, chatId);
  }, []);

  return { markAsRead };
}
