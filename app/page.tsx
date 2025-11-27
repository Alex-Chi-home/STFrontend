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
import ConnectionStatus from "@/components/ui/ConnectionStatus";

function ChatContent() {
  const { user } = useUserStore();
  const [mbIsSelected, setMbIsSelected] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const { incrementUnread, setCurrentChatId } = useWebSocketStore();

  // WebSocket event handlers
  const handleNewMessage = useCallback(
    (message: Message) => {
      console.log('handle new message ! from websocket', message)
      // Only add message to current chat if it belongs there
      if (message.chat_id === activeChatId) {
        // setMessages((prev) => {
        //   // Prevent duplicates
        //   console.log(prev.some((m) => m.id === message.id), 'IS DUPLICATE')
        //   if (prev.some((m) => m.id === message.id)) return prev;
        //   return [...prev, message];
        // });
      } else if (message.chat_id) {
        // Increment unread count for other chats
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

  const handleNewChat = useCallback((chat: Chat) => {
    setChats((prev) => {
      if (prev.some((c) => c.id === chat.id)) return prev;
      return [...prev, chat];
    });
  }, []);

  const handleChatDeleted = useCallback(
    (payload: { chatId: number }) => {
      setChats((prev) => prev.filter((c) => c.id !== payload.chatId));
      if (activeChatId === payload.chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    },
    [activeChatId]
  );

  // Subscribe to WebSocket events
  useMessageEvents(handleNewMessage, handleMessageDeleted);
  useChatEvents(handleNewChat, handleChatDeleted);

  // Update current chat ID in store
  useEffect(() => {
    setCurrentChatId(activeChatId);
  }, [activeChatId, setCurrentChatId]);

  function setNewMessage(content: string) {
    if (!activeChatId) return;

    // Optimistic update: add message immediately with temp ID
    const tempMessage: Message = {
      id: -Date.now(), // Negative ID for temp messages
      chat_id: activeChatId,
      content,
      sender_id: user?.id || undefined,
      sent_at: new Date().toISOString(),
      sender: user || undefined,
    };
    // setMessages((prev) => [...prev, tempMessage]); for more quick intrct

    const messagePayload = {
      chatId: activeChatId,
      content,
    };

    sendMessageAPI(messagePayload).then((res) => {
      if (res) {
        // Replace temp message with real one NOT WORKING IF HAVENT TEMP MESSAGE
        // setMessages((prev) =>
        //   prev.map((m) => (m.id === tempMessage.id ? res : m))
        // );
      } else {
        // Remove temp message on error
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
      createPrivateChatAPI({ otherUserId }).then((res) => {
        console.log(res, 'create chat res')
        // if (res) { prevent duplicate from socket
        //   setChats((prev) => [...prev, res]);
        // }
      });
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

  function onMbBack() {
    setMbIsSelected(true);
  }

  function onSetActiveChat(activeChat: number) {
    setMbIsSelected(false);
    setActiveChatId(activeChat);
  }

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
          chatId={activeChatId}
          messages={messages}
          setNewMessage={setNewMessage}
          handleDeleteMessage={handleDeleteMessage}
          onMBBack={onMbBack}
        />
      ) : null}

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
      />

      {/* Connection status indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <ConnectionStatus showLabel={true} />
      </div>
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
