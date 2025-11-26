"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TypingIndicatorProps {
  isTyping: boolean;
  userCount?: number;
}

export default function TypingIndicator({ isTyping, userCount = 1 }: TypingIndicatorProps) {
  const text = userCount > 1 
    ? `${userCount} пользователей печатают...` 
    : "печатает...";

  return (
    <AnimatePresence>
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500"
        >
          <div className="flex gap-1">
            <motion.span
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.span
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: 0.15,
              }}
            />
            <motion.span
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: 0.3,
              }}
            />
          </div>
          <span>{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

