"use client";
import { useEffect, useState, useCallback } from "react";
import ChatList from "@/components/ui/ChatList";
import ChatWindow from "@/components/ui/ChatWindow";
import { Chat, ChatType, Message, User } from "@/lib/types";
import { useUserStore } from "@/lib/store/user";
import {
  createGroupChatAPI,
  createPrivateChatAPI,
  getChatsAPI,
} from "@/lib/api/chats";
import { getMessagesAPI, sendMessageAPI } from "@/lib/api/messages";
import { deleteMessageAPI } from "../lib/api/messages";
import NewChatModal from "@/components/ui/NewChatModal";
import WebSocketProvider, { useAuthToken } from "@/providers/WebSocketProvider";
import { useMessageEvents, useChatEvents } from "@/lib/websocket/hooks";
import { useWebSocketStore } from "@/lib/websocket/store";
import { useChatStore } from "@/lib/store/chats";

function ChatContent() {
  const { user } = useUserStore();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const { activeChatId, setActiveChatId } = useChatStore();

  const { incrementUnread, setCurrentChatId } = useWebSocketStore();

  // WebSocket event handlers
  const handleNewMessage = useCallback(
    (message: Message) => {
      if (message.chat_id === activeChatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      } else if (message.chat_id) {
        incrementUnread(message.chat_id);
      }
    },
    [activeChatId, incrementUnread]
  );

  const handleMessageDeleted = useCallback(
    (payload: { chatId: number; messageId: number }) => {
      if (payload.chatId === activeChatId) {
        setMessages((prev) => prev.filter((m) => m.id !== payload.messageId));
      }
    },
    [activeChatId]
  );

  const handleNewChat = useCallback(
    (chat: Chat) => {
      setChats((prev) => {
        if (prev.some((c) => c.id === chat.id)) return prev;
        return [...prev, chat];
      });
      setActiveChatId(chat.id);
    },
    [setActiveChatId]
  );

  const handleChatDeleted = useCallback(
    (payload: { chatId: number }) => {
      setChats((prev) => prev.filter((c) => c.id !== payload.chatId));
      if (activeChatId === payload.chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    },
    [activeChatId, setActiveChatId]
  );

  useMessageEvents(handleNewMessage, handleMessageDeleted);
  useChatEvents(handleNewChat, handleChatDeleted);

  useEffect(() => {
    setCurrentChatId(activeChatId);
  }, [activeChatId, setCurrentChatId]);

  useEffect(() => {
    function extractChatId(hash: string): string {
      if (hash.startsWith("#chat/")) {
        return hash.replace("#chat/", "");
      }
      return "";
    }
    if (!activeChatId && extractChatId(window.location.hash)) {
      setActiveChatId(+extractChatId(window.location.hash));
    }
  }, [activeChatId, setActiveChatId]);

  function setNewMessage(content: string) {
    if (!activeChatId) return;

    // Optimistic update: NOT NESSESARY NEED TEST
    const tempMessage: Message = {
      id: -Date.now(), // !!!
      chat_id: activeChatId,
      content,
      sender_id: user?.id || undefined,
      sent_at: new Date().toISOString(),
      sender: user || undefined,
    };
    // setMessages((prev) => [...prev, tempMessage]);  OLD LOGIC NEED REMOVE INVOCE DUPLICATES

    const messagePayload = {
      chatId: activeChatId,
      content,
    };

    sendMessageAPI(messagePayload).then((res) => {
      if (res) {
        // setMessages((prev) =>
        // [...prev, res]
        // ); OLD LOGIC ! NEED REMOVE
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      }
    });
  }

  const handleCreateChat = (
    selectedUsers: User[],
    chatType: ChatType,
    groupName?: string
  ) => {
    if (chatType === ChatType.Private && selectedUsers[0].id) {
      const otherUserId = +selectedUsers[0].id;
      createPrivateChatAPI({ otherUserId });
    }
    if (chatType === ChatType.Group && groupName) {
      const memberIds = selectedUsers.map((u) => Number(u.id));
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
    async function getMessages(chatId: number) {
      const messagesData = await getMessagesAPI(chatId);
      setMessages(messagesData || []);
    }
    if (activeChatId) {
      getMessages(activeChatId);
    }
  }, [activeChatId]);

  function onSetActiveChat(activeChat: number) {
    setActiveChatId(activeChat);
  }

  return (
    <div className="flex h-full">
      <ChatList
        chats={chats}
        activeChat={activeChatId}
        setActiveChat={onSetActiveChat}
        onAddNewChat={() => setIsNewChatModalOpen(true)}
      />

      {
        <ChatWindow
          userId={user?.id || null}
          chatId={activeChatId}
          messages={messages}
          setNewMessage={setNewMessage}
          handleDeleteMessage={handleDeleteMessage}
        />
      }

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
}

export default function Home() {
  const token = useAuthToken();

  return (
    <WebSocketProvider token={token}>
      <ChatContent />
    </WebSocketProvider>
  );
}
