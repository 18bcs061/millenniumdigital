import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { ProductReel } from "@/components/products/ProductReel";

export function RecommendedProducts({ products }: { products: ProductListItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-navy via-[#170b12] to-black shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="font-heading text-base font-bold text-white">Recommended for You</p>
        </div>
        <Link href="/products" className="flex items-center gap-1 text-xs font-bold text-brand-accent hover:underline">
          Browse All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ProductReel products={products} />
    </div>
  );
}
