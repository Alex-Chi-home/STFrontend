import { deleteGroupChatAPI } from "@/lib/api/chats";
import { Chat } from "@/lib/types";
import { TrashIcon } from "@radix-ui/react-icons";

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
  function handleDelete(chatId: number) {
    deleteGroupChatAPI(`${chatId}`);
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 h-[100dvh] sm:h-full flex flex-col relative">
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
            <div
              onClick={() => setActiveChat(chat.id)}
              className="flex items-center justify-between"
            >
              <div>
                <h3 className="text-base font-medium">
                  {chat.name || "Private chat " + chat.id}
                </h3>
                <p
                  className={`text-sm ${
                    activeChat === chat.id ? "text-white" : "text-gray-500"
                  } truncate`}
                ></p>
              </div>
              <span className="text-xs text-gray-400">{chat.updated_at}</span>
            </div>
            <button
              onClick={() => handleDelete(chat.id)}
              className="w-full cursor-pointer text-sm  text-red-600 flex items-center gap-2  p-2 hover:bg-gray-200 rounded-md transition-colors"
              title="Delete message"
            >
              <TrashIcon className="w-4 h-4 " />
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-6 z-10">
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
