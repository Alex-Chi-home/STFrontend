"use client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import MessageBubble from "./MessageBubble/MessageBubble";
import MessageInput from "./MessageInput";
import { Message } from "@/lib/types";

export default function ChatWindow({
  userId,
  messages = [],
  setNewMessage,
  handleDeleteMessage,
  onMBBack,
}: {
  userId: number | null;
  messages: Message[];
  setNewMessage: (text: string, id: number | null) => void;
  handleDeleteMessage: (id: number | null) => void;
  onMBBack: () => void;
}) {
  const [message, setMessage] = useState<Message>({ id: null, content: "" });
  const TextInputRef = useRef<HTMLInputElement>(null);

  const onEdit = (message: Message) => {
    TextInputRef.current?.focus();
    setMessage({ id: message.id, content: message.content });
  };

  return (
    <div className="flex-1 flex flex-col h-full max-h-screen relative">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              userId={userId}
              key={message.id}
              message={message}
              onEdit={onEdit}
              onDelete={handleDeleteMessage}
            />
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 bg-white border-t border-gray-200">
        <MessageInput
          message={message}
          setMessage={setMessage}
          setNewMessage={setNewMessage}
          ref={TextInputRef}
        />
        <div className="sm:hidden">
          <button
            onClick={onMBBack}
            className="absolute left-4 -top-14 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-100 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
