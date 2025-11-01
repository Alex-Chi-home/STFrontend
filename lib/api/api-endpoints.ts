export const ApiEndpoints = {
  USER: "/user",
  USERS: "/users",
  REGISTER: "/auth/register",
  LOGIN_USER: "/auth/login",
  CHATS: (chatId: string) => `/chats/${chatId}`,
  PRIVATE_CHATS: "/chats/private",
  GROUP_CHATS: "/chats/group",
  MESSAGES: (chatId: string) => `/messages/${chatId}`,
};
