"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { ProductGrid } from "@/components/products/ProductGrid";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-rose-500" />
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">Your Wishlist</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <Heart className="h-10 w-10 text-slate-300" />
          <p className="font-heading text-lg font-bold text-slate-800">Your wishlist is empty</p>
          <Link href="/products" className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-bold text-white shadow-md">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ProductGrid products={items.map((item) => item.product)} />
      )}
    </div>
  );
}
