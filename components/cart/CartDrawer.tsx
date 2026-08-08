"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useUiStore } from "@/lib/stores/ui-store";
import { CartView } from "@/components/cart/CartView";

export function CartDrawer() {
  const { cartDrawerOpen, closeCartDrawer } = useUiStore();

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
          />
          <motion.div
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-brand-surface p-5 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-extrabold text-slate-900">Your Cart</h2>
              <button onClick={closeCartDrawer} className="rounded-full p-2 hover:bg-slate-200/60">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <CartView variant="drawer" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
