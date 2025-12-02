"use client";
import { toast } from "react-toastify";
import { GET } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { User } from "../types";

export const getUsersAPI = async (): Promise<User[] | []> => {
  try {
    const response = await GET(ApiEndpoints.USERS);

    if (response.ok) {
      return response.data;
    }
    toast.error(`Error: ${response.message}`);
    return [];
  } catch (error) {
    toast(`Error: ${error}`);
    return [];
  }
};
