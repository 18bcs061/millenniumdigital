"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { formatMoney } from "@/lib/currency";
import { CategoryArt } from "@/components/CategoryArt";
import { StockBadge } from "@/components/StockBadge";
import { RatingStars } from "@/components/RatingStars";
import { WishlistButton } from "@/components/WishlistButton";
import { CompareCheckbox } from "@/components/CompareCheckbox";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Sticker } from "@/components/Sticker";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/cn";

function seedFromString(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return hash;
}

function ProductMedia({ product }: { product: ProductListItem }) {
  return product.images?.[0] ? (
    <Image
      src={product.images[0]}
      alt={product.name}
      fill
      className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
      sizes="(max-width: 640px) 50vw, 240px"
    />
  ) : (
    <CategoryArt categorySlug={product.category.slug} seed={seedFromString(product.sku)} />
  );
}

export function ProductCard({ product, view = "grid" }: { product: ProductListItem; view?: "grid" | "list" }) {
  const { currency } = useCurrencyStore();
  const seed = seedFromString(product.sku);
  const showHot = product.isFeatured && seed % 3 === 0;
  const showNew = !showHot && seed % 4 === 0;
  const isOutOfStock = product.availability === "OUT_OF_STOCK";

  if (view === "list") {
    return (
      <motion.div
        layout
        className="group relative flex gap-4 rounded-2xl border border-brand-primary/15 bg-gradient-to-br from-white via-rose-50/50 to-brand-primary/[0.07] p-4 shadow-[0_6px_20px_-14px_rgba(155,27,92,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:shadow-[0_20px_40px_-18px_rgba(155,27,92,0.4)]"
      >
        <Link
          href={`/products/${product.slug}`}
          className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#fdf1f7_55%,#f6d9e8_100%)]"
        >
          <ProductMedia product={product} />
          {showHot && <Sticker variant="hot" className="absolute left-1 top-1">🔥 Hot</Sticker>}
          {showNew && <Sticker variant="new" className="absolute left-1 top-1">✨ New</Sticker>}
        </Link>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-secondary">{product.category.name}</p>
              <Link href={`/products/${product.slug}`} className="font-heading text-base font-bold text-slate-900 hover:text-brand-primary">
                {product.name}
              </Link>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                <BadgeCheck className="h-3.5 w-3.5 text-brand-primary" /> {product.brand.name} · SKU {product.sku}
              </p>
            </div>
            <WishlistButton product={product} />
          </div>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          <p className="line-clamp-1 text-sm text-slate-500">{product.description}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-extrabold text-brand-primary">{formatMoney(product.priceINR, currency)}</span>
              <StockBadge availability={product.availability} />
            </div>
            <div className="flex items-center gap-2">
              <CompareCheckbox productId={product.id} />
              <AddToCartButton product={product} disabled={isOutOfStock} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <TiltCard intensity={10} className="group relative">
      <motion.div
        layout
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-primary/15 bg-gradient-to-br from-white via-rose-50/50 to-brand-primary/[0.07] shadow-[0_10px_30px_-16px_rgba(155,27,92,0.25)] transition-all duration-300 group-hover:border-brand-primary/50 group-hover:shadow-[0_28px_54px_-18px_rgba(155,27,92,0.45)]"
      >
        {/* Glossy top highlight, like light catching a raised surface */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-white/80 via-pink-50/40 to-transparent" />

        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#fdf1f7_55%,#f6d9e8_100%)]"
        >
          {/* Soft contact shadow the product appears to float above */}
          <div className="pointer-events-none absolute bottom-3 left-1/2 h-4 w-2/3 -translate-x-1/2 rounded-[100%] bg-brand-primary/15 blur-md transition-all duration-500 group-hover:w-1/2 group-hover:bg-brand-primary/25" />
          <ProductMedia product={product} />
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {showHot && <Sticker variant="hot">🔥 Hot</Sticker>}
            {showNew && <Sticker variant="new">✨ New</Sticker>}
          </div>
          <WishlistButton product={product} className="absolute right-2 top-2 z-10" />
        </Link>
        <div className="relative flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-secondary">{product.category.name}</p>
            <StockBadge availability={product.availability} className="scale-90" />
          </div>
          <Link href={`/products/${product.slug}`} className="line-clamp-2 font-heading text-sm font-bold leading-snug text-slate-900 hover:text-brand-primary">
            {product.name}
          </Link>
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <BadgeCheck className="h-3.5 w-3.5 text-brand-primary" /> {product.brand.name}
          </p>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          <div className="mt-1 flex items-center justify-between">
            <span className="font-heading text-lg font-extrabold text-brand-primary">{formatMoney(product.priceINR, currency)}</span>
            <CompareCheckbox productId={product.id} className="hidden sm:flex" />
          </div>
          <AddToCartButton product={product} disabled={isOutOfStock} full className={cn("mt-2")} />
        </div>
      </motion.div>
    </TiltCard>
  );
}
