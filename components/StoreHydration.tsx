"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useCompareStore } from "@/lib/stores/compare-store";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { useBomStore } from "@/lib/stores/bom-store";
import { useRfqStore } from "@/lib/stores/rfq-store";
import { useCommunityStore } from "@/lib/stores/community-store";

const PERSISTED_STORES = [
  useCartStore,
  useWishlistStore,
  useCompareStore,
  useCurrencyStore,
  useUiStore,
  useBomStore,
  useRfqStore,
  useCommunityStore,
];

/**
 * These stores use `skipHydration: true` so the very first client render matches
 * SSR (default in-memory state). Once mounted, we pull in the real localStorage
 * state here — a normal client-only update, not a hydration pass, so it can never
 * mismatch the server-rendered HTML.
 */
export function StoreHydration() {
  useEffect(() => {
    for (const store of PERSISTED_STORES) {
      store.persist.rehydrate();
    }
  }, []);

  return null;
}
