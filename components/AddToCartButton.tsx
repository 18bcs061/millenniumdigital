"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { useCartStore } from "@/lib/stores/cart-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/cn";

export function AddToCartButton({
  product,
  quantity = 1,
  disabled,
  className,
  full = false,
}: {
  product: ProductListItem;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  full?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const [added, setAdded] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, quantity);
        setAdded(true);
        openCartDrawer();
        setTimeout(() => setAdded(false), 1800);
      }}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
        full && "w-full",
        className
      )}
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {disabled ? "Out of Stock" : added ? "Added!" : "Add to Cart"}
    </button>
  );
}
