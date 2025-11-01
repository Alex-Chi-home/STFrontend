import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const userStorageHelper = {
  STORAGE_KEY: "telegramCloneUser",

  setUser(userData: User | null): User | null {
    try {
      if (typeof window === "undefined" || !userData) return null;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Ошибка при сохранении пользователя:", error);
      return null;
    }
  },

  getUser(): { id: number; username: string; email: string } | null {
    try {
      if (typeof window === "undefined") return null;
      const userData = localStorage.getItem(this.STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Ошибка при чтении пользователя:", error);
      return null;
    }
  },

  updateUser(
    updates: Partial<{ id: number; username: string; email: string }>
  ): { id: number; username: string; email: string } | null {
    try {
      if (typeof window === "undefined") return null;
      const currentUser = this.getUser();
      if (!currentUser) throw new Error("Пользователь не найден");

      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
      return null;
    }
  },

  removeUser(): boolean {
    try {
      if (typeof window === "undefined") return false;
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      return false;
    }
  },

  hasUser(): boolean {
    return typeof window !== "undefined" ? !!this.getUser() : false;
  },
};
