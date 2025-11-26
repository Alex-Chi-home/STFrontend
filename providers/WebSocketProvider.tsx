"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useWebSocketConnection } from "@/lib/websocket/hooks";
import { ConnectionBanner } from "@/components/ui/ConnectionStatus";
import { ConnectionStatus } from "@/lib/websocket/types";
import { getWebSocketTokenAction } from "@/lib/api/utils";

interface WebSocketContextValue {
  status: ConnectionStatus;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  disconnect: () => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}

interface WebSocketProviderProps {
  children: React.ReactNode;
  token: string | null;
  showConnectionBanner?: boolean;
}

export default function WebSocketProvider({
  children,
  token,
  showConnectionBanner = true,
}: WebSocketProviderProps) {
  const connection = useWebSocketConnection(token);

  return (
    <WebSocketContext.Provider value={connection}>
      {showConnectionBanner && <ConnectionBanner />}
      {children}
    </WebSocketContext.Provider>
  );
}


export function useAuthToken(): string | null {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchToken = async () => {
      try {
        const tokenValue = await getWebSocketTokenAction();
        if (isMounted) {
          setToken(tokenValue);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[WebSocket] Failed to get auth token:", error);
        if (isMounted) {
          setToken(null);
          setIsLoading(false);
        }
      }
    };

    fetchToken();

    return () => {
      isMounted = false;
    };
  }, []);

  return token;
}

