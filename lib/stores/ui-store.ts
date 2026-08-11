import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  cartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      view: "grid",
      setView: (view) => set({ view }),
      cartDrawerOpen: false,
      openCartDrawer: () => set({ cartDrawerOpen: true }),
      closeCartDrawer: () => set({ cartDrawerOpen: false }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    { name: "md-ui", partialize: (state) => ({ view: state.view }), skipHydration: true }
  )
);
