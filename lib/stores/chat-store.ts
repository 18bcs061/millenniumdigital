import { create } from "zustand";

interface ChatState {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  open: false,
  openChat: () => set({ open: true }),
  closeChat: () => set({ open: false }),
  toggleChat: () => set((s) => ({ open: !s.open })),
}));
