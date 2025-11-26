import { Message } from "@/lib/types";
import { Dispatch, RefObject, SetStateAction } from "react";

interface MessageInputProps {
  setNewMessage: (text: string, id: number | null) => void;
  message: Message;
  setMessage: Dispatch<SetStateAction<{ content: string; id: number | null }>>;
  ref: RefObject<HTMLInputElement | null>;
  onTyping?: () => void;
}

export default function MessageInput({
  setNewMessage,
  message,
  setMessage,
  ref,
  onTyping,
}: MessageInputProps) {
  const handleSend = () => {
    if (message.content.trim()) {
      setNewMessage(message.content, message.id);
      setMessage({ id: null, content: "" });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage((prev) => ({ ...prev, content: e.target.value }));
    // Trigger typing indicator on input
    onTyping?.();
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          type="text"
          value={message.content}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
