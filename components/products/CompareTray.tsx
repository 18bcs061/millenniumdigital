"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Scale, X } from "lucide-react";
import { useCompareStore } from "@/lib/stores/compare-store";
import { getProductsByIds } from "@/lib/catalog";

export function CompareTray() {
  const productIds = useCompareStore((s) => s.productIds);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const products = useMemo(() => getProductsByIds(productIds), [productIds]);

  return (
    <AnimatePresence>
      {productIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 mx-auto flex w-[95%] max-w-3xl items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur"
        >
          <div className="flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary">
            <Scale className="h-4 w-4" /> Compare ({productIds.length}/4)
          </div>
          <div className="flex flex-1 gap-2 overflow-x-auto">
            {productIds.map((id) => {
              const p = products.find((x) => x.id === id);
              return (
                <div key={id} className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-[10px] text-slate-400">
                  {p?.name ?? "…"}
                  <button onClick={() => remove(id)} className="absolute -right-1 -top-1 rounded-full bg-rose-500 p-0.5 text-white">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={clear} className="shrink-0 text-xs font-semibold text-slate-400 hover:text-rose-500">
            Clear
          </button>
          <Link
            href="/compare"
            className="shrink-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-xs font-bold text-white shadow-md"
          >
            Compare Now
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
