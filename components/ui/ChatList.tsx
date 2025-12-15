"use client";

import { Chat } from "@/lib/types";
import { FramerLogoIcon } from "@radix-ui/react-icons";
import { formatDate } from "@/helpers/formatDate";
import ChatAvatar from "./ChatAvatar";

export default function ChatList({
  chats = [],
  activeChat,
  onAddNewChat,
}: {
  chats: Chat[];
  activeChat: number | null;
  setActiveChat: (activeChat: number) => void;
  onAddNewChat: () => void;
}) {
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
            className={`p-4 flex ${
              activeChat === chat.id
                ? "bg-blue-500 text-white"
                : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
            } border-b border-gray-200`}
          >
            <div className="w-full flex items-center gap-3">
              <ChatAvatar
                name={"Chat"}
                photoUrl={null}
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
                      Chat name
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
