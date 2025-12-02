"use client";

import { create } from "zustand";
import { ConnectionStatus, TypingState } from "./types";

interface WebSocketStoreState {
  status: ConnectionStatus;
  setStatus: (status: ConnectionStatus) => void;

  currentChatId: number | null;
  setCurrentChatId: (chatId: number | null) => void;

  typingUsers: TypingState;
  addTypingUser: (chatId: number, userId: number) => void;
  removeTypingUser: (chatId: number, userId: number) => void;
  clearTypingUsers: (chatId: number) => void;

  unreadCounts: Record<number, number>;
  incrementUnread: (chatId: number) => void;
  clearUnread: (chatId: number) => void;
  setUnreadCount: (chatId: number, count: number) => void;

  pendingMessages: Array<{
    id: number;
    chatId: number;
    content: string;
    timestamp: number;
  }>;
  addPendingMessage: (chatId: number, content: string) => number;
  removePendingMessage: (id: number) => void;
  clearPendingMessages: () => void;

  reset: () => void;
}

const initialState = {
  status: "disconnected" as ConnectionStatus,
  currentChatId: null,
  typingUsers: {},
  unreadCounts: {},
  pendingMessages: [],
};

export const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

  addTypingUser: (chatId, userId) =>
    set((state) => {
      const current = state.typingUsers[chatId] || { users: [], userIds: [] };
      if (current.userIds.includes(userId)) {
        return state;
      }
      return {
        typingUsers: {
          ...state.typingUsers,
          [chatId]: {
            users: current.users,
            userIds: [...current.userIds, userId],
          },
        },
      };
    }),

  removeTypingUser: (chatId, userId) =>
    set((state) => {
      const current = state.typingUsers[chatId];
      if (!current) return state;
      return {
        typingUsers: {
          ...state.typingUsers,
          [chatId]: {
            users: current.users.filter((u) => u.id !== userId),
            userIds: current.userIds.filter((id) => id !== userId),
          },
        },
      };
    }),

  clearTypingUsers: (chatId) =>
    set((state) => {
      const { [chatId]: _removed, ...rest } = state.typingUsers;
      void _removed;
      return { typingUsers: rest };
    }),

  incrementUnread: (chatId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatId]: (state.unreadCounts[chatId] || 0) + 1,
      },
    })),

  clearUnread: (chatId) =>
    set((state) => {
      const { [chatId]: _removed, ...rest } = state.unreadCounts;
      void _removed;
      return { unreadCounts: rest };
    }),

  setUnreadCount: (chatId, count) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatId]: count,
      },
    })),

  addPendingMessage: (chatId, content) => {
    const id = Date.now();
    set((state) => ({
      pendingMessages: [
        ...state.pendingMessages,
        { id, chatId, content, timestamp: Date.now() },
      ],
    }));
    return id;
  },

  removePendingMessage: (id) =>
    set((state) => ({
      pendingMessages: state.pendingMessages.filter((msg) => msg.id !== id),
    })),

  clearPendingMessages: () => set({ pendingMessages: [] }),

  reset: () => set(initialState),
}));
