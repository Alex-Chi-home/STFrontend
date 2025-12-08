import { create } from "zustand";

interface AdminStore {
  sidebarIsOpen: boolean;
  setSidebarIsOpen: (isOpen: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => {
  return {
    sidebarIsOpen: false,
    setSidebarIsOpen: (isOpen: boolean) => set({ sidebarIsOpen: isOpen }),
  };
});
