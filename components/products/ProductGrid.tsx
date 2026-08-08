"use client";

import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { useUiStore } from "@/lib/stores/ui-store";
import { ProductCard } from "@/components/ProductCard";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  const view = useUiStore((s) => s.view);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
        <PackageSearch className="h-10 w-10 text-slate-300" />
        <p className="font-heading text-lg font-bold text-slate-800">No products match your filters</p>
        <p className="text-sm text-slate-500">Try adjusting or clearing filters to see more results.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer(0.04)}
      initial="hidden"
      animate="show"
      className={cn(view === "grid" ? "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-3")}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={fadeUp}>
          <ProductCard product={product} view={view} />
        </motion.div>
      ))}
    </motion.div>
  );
}
