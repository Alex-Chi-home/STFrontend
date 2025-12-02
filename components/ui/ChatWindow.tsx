"use client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRef, useState, useEffect } from "react";
import MessageBubble from "./MessageBubble/MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { Message } from "@/lib/types";
import { useChatRoom, useTypingIndicator } from "@/lib/websocket/hooks";

interface ChatWindowProps {
  activeChat: number | null;
  userId: number | null;
  chatId: number | null;
  messages: Message[];
  setNewMessage: (text: string, id: number | null) => void;
  handleDeleteMessage: (id: number | null) => void;
}

export default function ChatWindow({
  userId,
  chatId,
  messages = [],
  setNewMessage,
  handleDeleteMessage,
  activeChat
}: ChatWindowProps) {
  const [message, setMessage] = useState<Message>({ id: null, content: "" });
  const TextInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket
  useChatRoom(chatId);

  // WebSocket
  const { typingUserIds, isTyping, handleTyping } = useTypingIndicator(chatId);

  const onEdit = (editMessage: Message) => {
    TextInputRef.current?.focus();
    setMessage({ id: editMessage.id, content: editMessage.content });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full max-h-screen relative">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble
              userId={userId}
              key={msg.id}
              message={msg}
              onEdit={onEdit}
              onDelete={handleDeleteMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Typing indicator */}
      <TypingIndicator isTyping={isTyping} userCount={typingUserIds.length} />

      {!activeChat && <div className="flex items-center justify-center w-full h-full">
        <h2 className="text-lg font-semibold">Select a chat to start messaging</h2>
      </div> }

      {activeChat && <div className="sticky bottom-0 bg-white border-t border-gray-200">
        <MessageInput
          message={message}
          setMessage={setMessage}
          setNewMessage={setNewMessage}
          onTyping={handleTyping}
          ref={TextInputRef}
        />
      </div>}
    </div>
  );
}
