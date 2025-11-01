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
