"use client";

import { create } from "zustand";
import { ConnectionStatus } from "./types";

interface WebSocketStoreState {
  status: ConnectionStatus;
  setStatus: (status: ConnectionStatus) => void;

  reset: () => void;
}

const initialState = {
  status: "disconnected" as ConnectionStatus,
};

export const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  reset: () => set(initialState),
}));
