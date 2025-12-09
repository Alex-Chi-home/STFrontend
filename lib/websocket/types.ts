import { Chat, Message, User } from "../types";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

export enum ClientEvents {
  JOIN_CHAT = "join:chat",
  JOIN_CHATS = "join:chats",
  LEAVE_CHAT = "leave:chat",
  TYPING_START = "typing:start",
  TYPING_STOP = "typing:stop",
  MESSAGE_READ = "message:read",
}

export enum ServerEvents {
  CONNECTION_READY = "connection:ready",
  MESSAGE_NEW = "message:new",
  MESSAGE_DELETED = "message:deleted",
  CHAT_NEW = "chat:new",
  CHAT_DELETED = "chat:deleted",
  USER_TYPING = "user:typing",
  USER_STOPPED_TYPING = "user:stopped-typing",
  MESSAGE_READ_STATUS = "message:read-status",
  JOINED_CHAT = "joined:chat",
  LEFT_CHAT = "left:chat",
}

export interface TypingPayload {
  chatId: number;
}

export interface MessageReadPayload {
  messageId: number;
  chatId: number;
}

export interface MessageDeletedPayload {
  chatId: number;
  messageId: number;
}

export interface ChatDeletedPayload {
  chatId: number;
}

export interface UserTypingPayload {
  userId: number;
  chatId: number;
}

export interface MessageReadStatusPayload {
  messageId: number;
  userId: number;
  status: "read" | "delivered";
}

export interface JoinedChatPayload {
  chatId: number;
}

export interface LeftChatPayload {
  chatId: number;
}

export interface ConnectionReadyPayload {
  userId: number;
  socketId: string;
}

export interface WebSocketMessage extends Message {
  status?: "sending" | "sent" | "delivered" | "read" | "error";
  tempId?: number; // For optimistic updates
}

export interface ServerToClientEvents {
  [ServerEvents.CONNECTION_READY]: (payload: ConnectionReadyPayload) => void;
  [ServerEvents.MESSAGE_NEW]: (message: Message) => void;
  [ServerEvents.MESSAGE_DELETED]: (payload: MessageDeletedPayload) => void;
  [ServerEvents.CHAT_NEW]: (chat: Chat) => void;
  [ServerEvents.CHAT_DELETED]: (payload: ChatDeletedPayload) => void;
  [ServerEvents.USER_TYPING]: (payload: UserTypingPayload) => void;
  [ServerEvents.USER_STOPPED_TYPING]: (payload: UserTypingPayload) => void;
  [ServerEvents.MESSAGE_READ_STATUS]: (
    payload: MessageReadStatusPayload
  ) => void;
  [ServerEvents.JOINED_CHAT]: (payload: JoinedChatPayload) => void;
  [ServerEvents.LEFT_CHAT]: (payload: LeftChatPayload) => void;
}

export interface ClientToServerEvents {
  [ClientEvents.JOIN_CHAT]: (chatId: number) => void;
  [ClientEvents.JOIN_CHATS]: (chatIds: number[]) => void;
  [ClientEvents.LEAVE_CHAT]: (chatId: number) => void;
  [ClientEvents.TYPING_START]: (payload: TypingPayload) => void;
  [ClientEvents.TYPING_STOP]: (payload: TypingPayload) => void;
  [ClientEvents.MESSAGE_READ]: (payload: MessageReadPayload) => void;
}

export interface TypingState {
  [chatId: number]: {
    users: User[];
    userIds: number[];
  };
}

export interface WebSocketState {
  status: ConnectionStatus;
  currentChatId: number | null;
  typingUsers: TypingState;
  joinedChats: Set<number>;
}
