"use client";
import { toast } from "react-toastify";
import { GET } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { Message } from "../types";

export interface SendMessageData {
  chatId: number;
  content: string;
}

export interface DeleteMessageData {
  chatId: number;
  id: number;
}

export const getMessagesAPI = async (
  chatId: number
): Promise<Message[] | null> => {
  try {
    const response = await GET(ApiEndpoints.MESSAGES(String(chatId)));
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
