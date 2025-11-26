"use server";

import { cookies } from "next/headers";

export const getAuthTokenAction = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.AUTH_TOKEN_COOKIE || "jwt");

  if (token) {
    return `${token.name}=${token.value}`;
  } else {
    return false;
  }
};

/**
 * Get the raw JWT token value for WebSocket authentication
 * This is a server action that can read httpOnly cookies
 */
export const getWebSocketTokenAction = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.AUTH_TOKEN_COOKIE || "jwt");

  if (token) {
    return token.value;
  }
  return null;
};
