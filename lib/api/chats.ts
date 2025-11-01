"use client";
import { toast } from "react-toastify";
import { DELETE, GET, POST } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { Chat } from "../types";

interface CreatePrivateChatPayload {
  otherUserId: number;
}

interface CreateGroutChatPayload {
  name: string;
  memberIds: number[];
}

export const getChatsAPI = async (): Promise<Chat[] | null> => {
  try {
    const response = await GET(ApiEndpoints.CHATS(""));
    if (response.ok) {
      return response.data;
    }
    toast.error(`Error: ${response.message}`);
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    return null;
  }
};

export const createPrivateChatAPI = async (
  payload: CreatePrivateChatPayload
): Promise<Chat | null> => {
  try {
    const response = await POST(ApiEndpoints.PRIVATE_CHATS, payload);
    if (response.ok) {
      return response.data;
    }
    toast.error(`Error: ${response.message}`);
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    return null;
  }
};

export const createGroupChatAPI = async (
  payload: CreateGroutChatPayload
): Promise<Chat[] | null> => {
  try {
    const response = await POST(ApiEndpoints.GROUP_CHATS, payload);

    if (response.ok) {
      return response.data;
    }
    toast.error(`Error: ${response.message}`);
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    return null;
  }
};

export const deleteGroupChatAPI = async (
  chatId: string
): Promise<Chat[] | null> => {
  try {
    const response = await DELETE(ApiEndpoints.CHATS(chatId));
    if (response.ok) {
      return response.data;
    }
    toast.error(`Error: ${response.message}`);
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    return null;
  }
};
