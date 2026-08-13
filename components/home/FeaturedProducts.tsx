import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { ProductReel } from "@/components/products/ProductReel";

export function FeaturedProducts({ products }: { products: ProductListItem[] }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#170b12] to-black py-14">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-accent">
              <Flame className="h-3.5 w-3.5" /> Trending Now
            </p>
            <h2 className="font-heading text-2xl font-extrabold text-white md:text-3xl">Featured Components</h2>
          </div>
          <Link href="/products" className="hidden items-center gap-1 text-sm font-bold text-brand-accent hover:underline sm:flex">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <ProductReel products={products} />
    </section>
  );
}
