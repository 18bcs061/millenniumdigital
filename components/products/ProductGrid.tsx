"use client";

import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { useUiStore } from "@/lib/stores/ui-store";
import { ProductCard } from "@/components/ProductCard";
import { ProductReel } from "@/components/products/ProductReel";
import { staggerContainer, fadeUp } from "@/lib/motion";

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

  if (view === "grid") {
    // No dark panel here — the cards already carry their own glow, so the
    // reel drops straight onto the page instead of boxing itself in next to
    // the (light) filters sidebar.
    return <ProductReel products={products} rowSize={20} speed={2} panel={false} />;
  }

  return (
    <motion.div variants={staggerContainer(0.04)} initial="hidden" animate="show" className="flex flex-col gap-3">
      {products.map((product) => (
        <motion.div key={product.id} variants={fadeUp}>
          <ProductCard product={product} view="list" />
        </motion.div>
      ))}
    </motion.div>
  );
}
