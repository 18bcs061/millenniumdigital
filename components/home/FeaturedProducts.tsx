import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { ProductGrid } from "@/components/products/ProductGrid";

export function FeaturedProducts({ products }: { products: ProductListItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-accent">
            <Flame className="h-3.5 w-3.5" /> Trending Now
          </p>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">Featured Components</h2>
        </div>
        <Link href="/products" className="hidden items-center gap-1 text-sm font-bold text-brand-primary hover:underline sm:flex">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
