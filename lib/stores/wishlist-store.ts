import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartProduct } from "@/lib/stores/cart-store";

export interface WishlistLine {
  id: string;
  product: CartProduct;
}

interface WishlistState {
  items: WishlistLine[];
  isWishlisted: (productId: string) => boolean;
  toggle: (product: CartProduct) => void;
}

/** Wishlist is stored entirely in the browser (localStorage) — no backend yet. */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isWishlisted: (productId) => get().items.some((i) => i.product.id === productId),
      toggle: (product) => {
        const exists = get().items.some((i) => i.product.id === product.id);
        if (exists) set({ items: get().items.filter((i) => i.product.id !== product.id) });
        else set({ items: [...get().items, { id: product.id, product }] });
      },
    }),
    { name: "md-wishlist" }
  )
);
