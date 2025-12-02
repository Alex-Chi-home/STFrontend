import { create } from "zustand";

interface AdminStore {
  sidebarIsOpen: boolean;
  mobileChatIsOpen: boolean;
  setSidebarIsOpen: (isOpen: boolean) => void;
  setMobileChatIsOpen: (isOpen: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => {
  return {
    sidebarIsOpen: false,
    mobileChatIsOpen: true,
    setSidebarIsOpen: (isOpen: boolean) => set({ sidebarIsOpen: isOpen }),
    setMobileChatIsOpen: (isOpen: boolean) => set({ mobileChatIsOpen: isOpen }),
  };
});
