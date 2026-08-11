import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductListItem } from "@/lib/types";

export type CartProduct = ProductListItem;

export interface CartLine {
  id: string;
  quantity: number;
  product: CartProduct;
}

interface CartState {
  items: CartLine[];
  addItem: (product: CartProduct, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  count: () => number;
  subtotalINR: () => number;
}

/**
 * Cart is stored entirely in the browser (localStorage) — no backend yet.
 * Swap this for a server-backed store once a database is reconnected.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
          set({ items: get().items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)) });
        } else {
          set({ items: [...get().items, { id: product.id, quantity, product }] });
        }
      },
      updateQuantity: (id, quantity) => set({ items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)) }),
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotalINR: () => get().items.reduce((sum, i) => sum + i.quantity * i.product.priceINR, 0),
    }),
    { name: "md-cart", skipHydration: true }
  )
);
