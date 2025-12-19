import { create } from "zustand";
import { userStorageHelper } from "../utils";
import { User } from "../types";
import { logoutUserAPI } from "../api/auth";

interface UserStore {
  user: User | null;
  users: User[];
  setUser: (user: User | null) => void;
  setUsers: (users: User[] | []) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => {
  const defaultUser = {
    id: userStorageHelper.getUser()?.id || null,
    username: "",
    email: "",
  };

  return {
    user: defaultUser,
    users: [],
    setUser: (user) => {
      if (user) {
        userStorageHelper.setUser({
          id: user.id || null,
          username: user.username,
          email: user.email,
        });
      }

      return set({ user });
    },
    setUsers: (users) => {
      return set({ users });
    },
    logout: () => {
      logoutUserAPI();
      userStorageHelper.removeUser();
      return set({
        user: {
          id: null,
          username: "",
          email: "",
        },
      });
    },
  };
});
