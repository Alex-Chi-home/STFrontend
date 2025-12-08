import { create } from "zustand";

interface ChatsStore {
  activeChatId: number | null;
  setActiveChatId: (id: number | null) => void;
}

export const useChatStore = create<ChatsStore>((set) => {
  return {
    activeChatId: null,
    setActiveChatId: (id: number | null) => {
      set({ activeChatId: id });
      window.location.hash = id ? `chat/${id}` : "";
    },
  };
});
