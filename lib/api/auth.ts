"use client";
import { toast } from "react-toastify";
import { POST } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { User } from "../types";

export interface RegisterUserData {
  username: string;
  password: string;
  email: string;
}

export const registerUserAPI = async (
  payload: RegisterUserData
): Promise<User | null> => {
  try {
    const response = await POST(ApiEndpoints.REGISTER, payload);

    if (response.ok) {
      toast.success(`User created !`);
      return response.data.user;
    }
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    return null;
  }
};
