"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { AddToCartButton } from "@/components/AddToCartButton";
import { WishlistButton } from "@/components/WishlistButton";

export function ProductActions({ product, disabled }: { product: ProductListItem; disabled: boolean }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1 rounded-full border border-slate-200 px-1">
        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-sm font-bold">{quantity}</span>
        <button onClick={() => setQuantity((q) => q + 1)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <AddToCartButton product={product} quantity={quantity} disabled={disabled} className="px-6 py-3 text-base" />
      <WishlistButton product={product} className="h-11 w-11" />
    </div>
  );
}
