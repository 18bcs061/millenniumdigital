import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/account/SectionHeader";

export function RecommendedProducts({ products }: { products: ProductListItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeader
        icon={Sparkles}
        title="Recommended for You"
        iconClassName="bg-brand-accent/10 text-brand-accent"
        action={
          <Link href="/products" className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline">
            Browse All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} view="grid" />
        ))}
      </div>
    </div>
  );
}
