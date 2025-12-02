"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWebSocketStore } from "@/lib/websocket/store";
import { ConnectionStatus as ConnectionStatusType } from "@/lib/websocket/types";

const statusConfig: Record<
  ConnectionStatusType,
  { color: string; text: string; showPulse: boolean }
> = {
  connected: {
    color: "bg-green-500",
    text: "Подключено",
    showPulse: false,
  },
  connecting: {
    color: "bg-yellow-500",
    text: "Подключение...",
    showPulse: true,
  },
  disconnected: {
    color: "bg-red-500",
    text: "Отключено",
    showPulse: false,
  },
  reconnecting: {
    color: "bg-orange-500",
    text: "Переподключение...",
    showPulse: true,
  },
};

interface ConnectionStatusProps {
  showLabel?: boolean;
  className?: string;
}

export default function ConnectionStatus({
  showLabel = false,
  className = "",
}: ConnectionStatusProps) {
  const { status } = useWebSocketStore();
  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
        {config.showPulse && (
          <motion.div
            className={`absolute inset-0 rounded-full ${config.color}`}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500">{config.text}</span>
      )}
    </div>
  );
}

// Toast-style connection banner for offline status
export function ConnectionBanner() {
  const { status } = useWebSocketStore();
  const showBanner = status === "disconnected" || status === "reconnecting";

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-sm text-white ${
            status === "disconnected" ? "bg-red-500" : "bg-orange-500"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {status === "reconnecting" && (
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
            <span>
              {status === "disconnected"
                ? "Соединение потеряно. Проверьте подключение к интернету."
                : "Переподключение к серверу..."}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
