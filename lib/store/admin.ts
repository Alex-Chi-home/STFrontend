import { create } from "zustand";

interface AdminStore {
  sidebarIsOpen: boolean;
  mobChatListIsOpen: boolean;
  setSidebarIsOpen: (isOpen: boolean) => void;
  setMobChatListIsOpen: (isOpen: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => {
  return {
    sidebarIsOpen: false,
    mobChatListIsOpen: true,
    setSidebarIsOpen: (isOpen: boolean) => set({ sidebarIsOpen: isOpen }),
    setMobChatListIsOpen: (isOpen: boolean) =>
      set({ mobChatListIsOpen: isOpen }),
  };
});
