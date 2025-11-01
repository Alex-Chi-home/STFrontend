"use client";
import { useEffect, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { getUsersAPI } from "@/lib/api/users";
import { ChatType, User } from "@/lib/types";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (
    selectedUsers: User[],
    chatType: ChatType,
    groupName?: string
  ) => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onCreateChat,
}: NewChatModalProps) {
  const [chatType, setChatType] = useState<ChatType>(ChatType.Private);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = availableUsers.filter(
    (user) =>
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.some((selected) => selected.id === user.id)
  );

  useEffect(() => {
    async function getUsers() {
      const users = await getUsersAPI();

      setAvailableUsers(users);
    }
    getUsers();
  }, []);

  const handleCreateChat = () => {
    const users = [...selectedUsers]
    if (chatType === "private" && selectedUsers.length !== 1) {
      return; // Need exactly one user for private chat
    }
    if (chatType === "group" && (!selectedUsers.length || !groupName)) {
      return; // Need at least one user and a group name for group chat
    }
    onCreateChat(
      users,
      chatType,
      chatType === "group" ? groupName : undefined
    );
    resetForm();
  };

  const resetForm = () => {
    setSelectedUsers([]);
    setChatType(ChatType.Private);
    setGroupName("");
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 shadow-xl rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <Cross2Icon className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create New Chat</h2>

        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded-md ${
                chatType === ChatType.Private
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setChatType(ChatType.Private)}
            >
              Private Chat
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md ${
                chatType === "group"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setChatType(ChatType.Group)}
            >
              Group Chat
            </button>
          </div>

          {chatType === "group" && (
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
          )}

          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {selectedUsers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Selected Users:
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{user.username}</span>
                  <button
                    onClick={() =>
                      setSelectedUsers((prev) =>
                        prev.filter((u) => u.id !== user.id)
                      )
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="max-h-48 overflow-y-auto mb-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                if (chatType === "private" && selectedUsers.length === 0) {
                  setSelectedUsers([user]);
                } else if (chatType === "group") {
                  setSelectedUsers((prev) => [...prev, user]);
                }
              }}
              className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-gray-600">{user.username[0]}</span>
                )}
              </div>
              <span className="text-gray-800">{user.username}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleCreateChat}
          disabled={
            (chatType === "private" && selectedUsers.length !== 1) ||
            (chatType === "group" && (!selectedUsers.length || !groupName))
          }
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Create Chat
        </button>
      </div>
    </div>
  );
}
