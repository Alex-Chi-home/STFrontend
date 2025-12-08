"use client";

import { deleteGroupChatAPI } from "@/lib/api/chats";
import { Chat } from "@/lib/types";
import { FramerLogoIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState, useCallback } from "react";
import ChatContextMenue from "./ChatContextMenue";
import { useUserStore } from "@/lib/store/user";
import { formatDate } from "@/helpers/formatDate";
import ChatAvatar from "./ChatAvatar";

const LONG_PRESS_DURATION = 500; // ms

export default function ChatList({
  chats = [],
  activeChat,
  setActiveChat,
  onAddNewChat,
}: {
  chats: Chat[];
  activeChat: number | null;
  setActiveChat: (activeChat: number) => void;
  onAddNewChat: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const { user } = useUserStore();

  const menuRef = useRef<HTMLDivElement>(null);
  const chatItemRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  function handleDelete(chatId: number) {
    deleteGroupChatAPI(`${chatId}`);
    setShowMenu(false);
    setSelectedChatId(null);
  }

  // Desktop: right-click
  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    chatId: number
  ) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY - 10 });
    setSelectedChatId(chatId);
    setShowMenu(true);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>, chatId: number) => {
      isLongPress.current = false;
      const touch = e.touches[0];

      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        setPosition({ x: touch.clientX, y: touch.clientY - 10 });
        setSelectedChatId(chatId);
        setShowMenu(true);

        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, LONG_PRESS_DURATION);
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const onChatClick = useCallback(
    (chatId: number) => {
      if (!isLongPress.current) {
        setActiveChat(chatId);
      }
      isLongPress.current = false;
    },
    [setActiveChat]
  );

  function getChatName(chat: Chat) {
    if (chat.chat_type === "group") {
      return chat.name;
    }

    if (user?.id === chat.created_by.id) return chat.members[0].username;

    return chat.created_by.username;
  }

  function getChatPhotoUrl(chat: Chat): string | null {
    // For group chats, there's no photo URL yet (could be added later)
    if (chat.chat_type === "group") {
      return null;
    }

    // For private chats, get the other user's avatar
    if (user?.id === chat.created_by.id) {
      return chat.members[0]?.avatarUrl || null;
    }

    return chat.created_by?.avatarUrl || null;
  }

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        chatItemRef.current &&
        !chatItemRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
        setSelectedChatId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`w-full md:w-100 sm:block ${activeChat ? "hidden" : "block"}`}
    >
      <div
        className="flex-1 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            ref={chatItemRef}
            className={`p-4 flex ${
              activeChat === chat.id
                ? "bg-blue-500 text-white"
                : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
            } border-b border-gray-200`}
            onContextMenu={(e) => handleRightClick(e, chat.id)}
            // Mobile: long press
            onTouchStart={(e) => handleTouchStart(e, chat.id)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onClick={() => onChatClick(chat.id)}
          >
            <div className="w-full flex items-center gap-3">
              <ChatAvatar
                name={getChatName(chat) || "Chat"}
                photoUrl={getChatPhotoUrl(chat)}
                chatId={chat.id}
                size="md"
              />

              {/* Chat Info */}
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {chat.chat_type === "group" && (
                      <FramerLogoIcon className="w-4 h-4 flex-shrink-0" />
                    )}
                    <h3 className="text-base font-semibold truncate">
                      {getChatName(chat)}
                    </h3>
                  </div>
                  <p
                    className={`text-sm ${
                      activeChat === chat.id ? "text-white/80" : "text-gray-500"
                    } truncate`}
                  >
                    {/* Last message preview could go here */}
                  </p>
                </div>

                {/* Timestamp */}
                <span
                  className={`text-xs flex-shrink-0 ml-2 ${
                    activeChat === chat.id ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {formatDate(chat.updated_at || "")}
                </span>
              </div>
            </div>
            {showMenu && selectedChatId === chat.id && (
              <ChatContextMenue
                // handleEdit={handleEdit}
                handleDelete={() => handleDelete(chat.id)}
                menuRef={menuRef}
                position={position}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 ml-[80%]">
        <div className="relative group">
          <button
            onClick={onAddNewChat}
            className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-200 cursor-pointer hover:scale-105"
            aria-label="Add new chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Add new chat
          </div>
        </div>
      </div>
    </div>
  );
}
