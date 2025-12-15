import { Message } from "@/lib/types";

interface ChatWindowProps {
  userId: number | null;
  chatId: number | null;
  messages: Message[];
  setNewMessage: (text: string, id: number | null) => void;
  handleDeleteMessage: (id: number | null) => void;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  return (
    <div
      className={`sm:flex ${chatId ? "flex" : "hidden"} flex-1 flex-col h-full max-h-screen relative`}
    >
      {!chatId && (
        <div className="flex items-center justify-center w-full h-full">
          <h2 className="text-lg font-semibold">
            Select a chat to start messaging
          </h2>
        </div>
      )}
    </div>
  );
}
