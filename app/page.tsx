"use client";
import { useEffect, useState } from "react";
import ChatList from "@/components/ui/ChatList";
import ChatWindow from "@/components/ui/ChatWindow";
import { Chat, ChatType, Message, User } from "@/lib/types";
import { useUserStore } from "@/lib/store/user";
// import { ChatSkeleton } from "@/components/ui/skeletons/ChatSkeleton";
import {
  createGroupChatAPI,
  createPrivateChatAPI,
  getChatsAPI,
} from "@/lib/api/chats";
import { getMessagesAPI, sendMessageAPI } from "@/lib/api/messages";
import { deleteMessageAPI } from "../lib/api/messages";
import NewChatModal from "@/components/ui/NewChatModal";

export default function Home() {
  const { user } = useUserStore();
  const [mbIsSelected, setMbIsSelected] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  function setNewMessage(content: string) {
    if (!activeChatId) return;
    const message = {
      chatId: activeChatId,
      content,
    };
    sendMessageAPI(message).then((res) => {
      if (res) setMessages((prev) => [...prev, res]);
    });
  }

  // const handleEditMessage = (message: Message) => {
  //   // In a real app, you would implement the edit functionality here
  //   // For example, open a modal or inline edit form
  //   console.warn("Edit message:", message.text);
  // };

  const handleCreateChat = (
    selectedUsers: User[],
    chatType: ChatType,
    groupName?: string
  ) => {
    if (chatType === ChatType.Private && selectedUsers[0].id) {
      const otherUserId = +selectedUsers[0].id;
      createPrivateChatAPI({ otherUserId }).then((res) => {
        if (res) {
          setChats((prev) => [...prev, res]);
        }
      });
    }
    if (chatType === ChatType.Group && groupName) {
      const memberIds = selectedUsers.map((user) => Number(user.id));
      createGroupChatAPI({ name: groupName, memberIds });
    }
    setIsNewChatModalOpen(false);
  };

  const handleDeleteMessage = (id: number | null) => {
    if (!activeChatId || !id) return;
    const payload = { chatId: activeChatId, id };
    deleteMessageAPI(payload).then((res) => {
      if (res) {
        setMessages((prev) =>
          [...prev].filter((message) => message?.id !== +res?.id)
        );
      }
    });
  };

  useEffect(() => {
    async function getChats() {
      const chatsData = await getChatsAPI();
      setChats(chatsData || []);
    }
    getChats();
  }, []);

  useEffect(() => {
    async function getMessages(activeChatId: number) {
      const messagesData = await getMessagesAPI(activeChatId);

      setMessages(messagesData || []);
    }
    if (activeChatId) {
      getMessages(activeChatId);
    }
  }, [activeChatId]);

  function onMbBack() {
    setMbIsSelected(true);
  }
  function onSetActiveChat(activeChat: number) {
    setMbIsSelected(false);
    setActiveChatId(activeChat);
  }

  // if (!user?.id) {
  //   return <ChatSkeleton />;
  // }

  return (
    <div className="flex h-full">
      <div className={`${mbIsSelected ? "block" : "hidden"} sm:block`}>
        <ChatList
          chats={chats}
          activeChat={activeChatId}
          setActiveChat={onSetActiveChat}
          onAddNewChat={() => setIsNewChatModalOpen(true)}
        />
      </div>

      {!mbIsSelected ? (
        <ChatWindow
          userId={user?.id || null}
          messages={messages}
          setNewMessage={setNewMessage}
          // handleEditMessage={handleEditMessage}
          handleDeleteMessage={handleDeleteMessage}
          onMBBack={onMbBack}
        />
      ) : null}

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
        // availableUsers={availableUsers}
      />
    </div>
  );
}
