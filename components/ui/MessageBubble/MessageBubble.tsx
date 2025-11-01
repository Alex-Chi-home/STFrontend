"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { Message } from "@/lib/types";
import { formatDate } from "@/helpers/formatDate";
import MessageMenue from "./MessageBubbleMenue";

interface MessageBubbleProps {
  userId: number | null;
  message: Message;
  onEdit?: (message: Message) => void;
  onDelete?: (id: number | null) => void;
}

export default function MessageBubble({
  userId,
  message,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const isUser = message.sender_id === userId;
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(message);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    setShowMenu(false);
  };

  const handleRightClick = (e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    e.preventDefault();
    setPosition({ x, y: y - 10 });
    setShowMenu(true);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const editedAt = formatDate(message?.edited_at || "");

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 relative`}
    >
      <div
        ref={bubbleRef}
        className={`max-w-xs p-3 rounded-lg relative ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        } cursor-pointer group`}
        onContextMenu={handleRightClick}
      >
        {isUser ? null : <strong>{message.sender?.username}</strong>}
        <p>{message.content}</p>
        <span className="text-xs opacity-70">{editedAt}</span>
      </div>
      {showMenu && (
        <MessageMenue
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          menuRef={menuRef}
          position={position}
        />
      )}
    </div>
  );
}
