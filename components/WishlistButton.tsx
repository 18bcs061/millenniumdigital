"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductListItem } from "@/lib/types";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { cn } from "@/lib/cn";

export function WishlistButton({
  product,
  className,
  tone = "light",
}: {
  product: ProductListItem;
  className?: string;
  tone?: "light" | "dark";
}) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full shadow-md ring-1 backdrop-blur-sm transition",
        tone === "dark"
          ? "bg-white/10 ring-white/15 hover:ring-brand-accent/60"
          : "bg-white ring-slate-200 hover:ring-brand-primary",
        className
      )}
      aria-label="Toggle wishlist"
    >
      <Heart
        className={cn(
          "h-4 w-4 transition",
          isWishlisted ? "fill-rose-500 text-rose-500" : tone === "dark" ? "text-white/60" : "text-slate-400"
        )}
      />
    </motion.button>
  );
}
