import { Sparkles } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export function CrossReferenceSuggestions({ query, products }: { query: string; products: ProductListItem[] }) {
  if (products.length === 0) return null;

  return (
    <div className="mt-10 rounded-2xl border border-dashed border-brand-primary/30 bg-brand-primary/5 p-5">
      <p className="mb-4 flex items-center gap-2 font-heading text-sm font-extrabold text-brand-primary">
        <Sparkles className="h-4 w-4" /> You searched “{query}” — cross-reference suggestions you might also need
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} view="grid" />
        ))}
      </div>
    </div>
  );
}
