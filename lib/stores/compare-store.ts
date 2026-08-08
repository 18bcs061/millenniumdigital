import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareState {
  productIds: string[];
  toggle: (id: string) => { added: boolean; limitReached: boolean };
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      productIds: [],
      has: (id) => get().productIds.includes(id),
      toggle: (id) => {
        const current = get().productIds;
        if (current.includes(id)) {
          set({ productIds: current.filter((p) => p !== id) });
          return { added: false, limitReached: false };
        }
        if (current.length >= MAX_COMPARE) {
          return { added: false, limitReached: true };
        }
        set({ productIds: [...current, id] });
        return { added: true, limitReached: false };
      },
      remove: (id) => set({ productIds: get().productIds.filter((p) => p !== id) }),
      clear: () => set({ productIds: [] }),
    }),
    { name: "md-compare" }
  )
);

export { MAX_COMPARE };
