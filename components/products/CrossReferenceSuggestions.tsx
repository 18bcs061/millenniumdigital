import { Sparkles } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { ProductReel } from "@/components/products/ProductReel";

export function CrossReferenceSuggestions({ query, products }: { query: string; products: ProductListItem[] }) {
  if (products.length === 0) return null;

  return (
    <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-[#170b12] to-black">
      <p className="flex items-center gap-2 px-6 pt-6 font-heading text-sm font-extrabold text-brand-accent">
        <Sparkles className="h-4 w-4" /> You searched “{query}” — cross-reference suggestions you might also need
      </p>
      <ProductReel products={products} speed={2} />
    </div>
  );
}
