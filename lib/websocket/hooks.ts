"use client";

import { useEffect, useCallback, useRef } from "react";
import { websocketService } from "./service";
import { useWebSocketStore } from "./store";
import { ServerEvents, ConnectionStatus, UserTypingPayload } from "./types";
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

    const unsubscribe = websocketService.onStatusChange((newStatus: ConnectionStatus) => {
      setStatus(newStatus);
    });

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


export function useChatRoom(chatId: number | null) {
  const prevChatIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevChatIdRef.current !== null && prevChatIdRef.current !== chatId) {
      websocketService.leaveChat(prevChatIdRef.current);
    }

    if (chatId !== null) {
      websocketService.joinChat(chatId);
    }

    prevChatIdRef.current = chatId;

    return () => {
      if (chatId !== null) {
        websocketService.leaveChat(chatId);
      }
    };
  }, [chatId]);
}


export function useTypingIndicator(chatId: number | null) {
  const { typingUsers, addTypingUser, removeTypingUser } = useWebSocketStore();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = useCallback(() => {
    if (chatId === null) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    websocketService.startTyping(chatId);

    typingTimeoutRef.current = setTimeout(() => {
      websocketService.stopTyping(chatId);
    }, 3000);
  }, [chatId]);

  useEffect(() => {
    if (chatId === null) return;

    const handleUserTyping = (payload: UserTypingPayload) => {
      if (payload.chatId === chatId) {
        addTypingUser(chatId, payload.userId);
      }
    };

    const handleUserStoppedTyping = (payload: UserTypingPayload) => {
      if (payload.chatId === chatId) {
        removeTypingUser(chatId, payload.userId);
      }
    };

    const unsubTyping = websocketService.on(ServerEvents.USER_TYPING, handleUserTyping as () => void);
    const unsubStoppedTyping = websocketService.on(
      ServerEvents.USER_STOPPED_TYPING,
      handleUserStoppedTyping as () => void
    );

    return () => {
      unsubTyping();
      unsubStoppedTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId, addTypingUser, removeTypingUser]);

  // Get typing users for current chat
  const currentTypingUsers = chatId !== null ? typingUsers[chatId]?.userIds || [] : [];

  return {
    typingUserIds: currentTypingUsers,
    isTyping: currentTypingUsers.length > 0,
    handleTyping,
    stopTyping: () => chatId !== null && websocketService.stopTyping(chatId),
  };
}

export function useMessageEvents(
  onNewMessage?: (message: Message) => void,
  onMessageDeleted?: (payload: { chatId: number; messageId: number }) => void
) {
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (onNewMessage) {
      unsubscribers.push(
        websocketService.on(ServerEvents.MESSAGE_NEW, onNewMessage as () => void)
      );
    }

    if (onMessageDeleted) {
      unsubscribers.push(
        websocketService.on(ServerEvents.MESSAGE_DELETED, onMessageDeleted as () => void)
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
        websocketService.on(ServerEvents.CHAT_DELETED, onChatDeleted as () => void)
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

