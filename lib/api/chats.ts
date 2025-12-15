"use client";
import { toast } from "react-toastify";
import { GET } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { Chat } from "../types";

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
