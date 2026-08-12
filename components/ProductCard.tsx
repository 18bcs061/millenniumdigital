"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
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

function ProductMedia({ product, className }: { product: ProductListItem; className?: string }) {
  return product.images?.[0] ? (
    <Image
      src={product.images[0]}
      alt={product.name}
      fill
      className={cn("object-contain p-4 transition-transform duration-500 group-hover:scale-110", className)}
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
  // Offsets the always-on card animations so neighbouring cards stay out of sync.
  const ambientDelay = (seed % 9) * 0.7;

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
    <TiltCard className="group relative h-full" intensity={6}>
      {/* The lift lives on this inner element, not the hover target itself —
          moving the element that owns :hover makes it slip out from under the
          cursor and flicker. */}
      <motion.div
        layout
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-brand-primary/40 group-hover:shadow-[0_20px_45px_-14px_rgba(155,27,92,0.4)]"
      >
        {/* Warm brand wash + light sweeps, all purely decorative. The idle layers
            are offset per card (seeded, so it stays stable across renders) to keep
            the grid from pulsing in unison. */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-brand-accent/8 via-transparent to-brand-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-2xl">
          <span className="card-ambient-sheen" style={{ animationDelay: `${ambientDelay}s` }} />
          <span className="card-shine" />
        </div>
        <span className="card-edge-line pointer-events-none z-30" style={{ animationDelay: `${ambientDelay * 0.6}s` }} />

        <Link
          href={`/products/${product.slug}`}
          className="relative z-10 block aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
        >
          {/* Glow behind the part: breathes on its own, brightens on hover. */}
          <span
            className="animate-glow-breathe pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 rounded-full bg-brand-accent/30 blur-3xl"
            style={{ animationDelay: `${ambientDelay * 0.45}s` }}
          />
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
          <ProductMedia
            product={product}
            className={cn("animate-media-drift", isOutOfStock && "grayscale-[35%] group-hover:grayscale-0")}
          />

          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {showHot && <Sticker variant="hot">🔥 Hot</Sticker>}
            {showNew && <Sticker variant="new">✨ New</Sticker>}
          </div>
          <WishlistButton
            product={product}
            className="absolute right-2 top-2 z-10 transition duration-300 group-hover:scale-110"
          />

          {/* Slides up from the bottom edge of the photo on hover. */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center gap-1 bg-gradient-to-t from-brand-navy/85 to-transparent py-2.5 text-xs font-bold text-white transition-transform duration-300 ease-out group-hover:translate-y-0">
            View Details <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <div className="relative z-10 flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-primary ring-1 ring-brand-primary/15 transition-colors duration-300 group-hover:bg-brand-primary/15">
              <span className="h-1 w-1 rounded-full bg-brand-accent" />
              {product.category.name}
            </span>
            <StockBadge availability={product.availability} className="scale-90" />
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 font-heading text-sm font-bold leading-snug text-slate-900 transition-colors duration-200 hover:text-brand-primary"
          >
            {product.name}
          </Link>
          <p className="flex items-center gap-1 text-xs text-slate-400 transition-colors duration-300 group-hover:text-slate-500">
            <BadgeCheck className="h-3.5 w-3.5 text-brand-primary transition-transform duration-300 group-hover:rotate-12" />
            {product.brand.name}
          </p>
          <div className="transition-transform duration-300 group-hover:translate-x-0.5">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          {/* Hairline that picks up the brand colour as the card is hovered. */}
          <div className="mt-1 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent transition-colors duration-500 group-hover:via-brand-primary/40" />

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="font-heading text-lg font-extrabold tabular-nums text-brand-primary transition-all duration-300 group-hover:scale-105 group-hover:text-brand-primary-dark">
              {formatMoney(product.priceINR, currency)}
            </span>
            <CompareCheckbox
              productId={product.id}
              className="hidden transition-all duration-200 hover:scale-105 hover:bg-brand-primary/10 active:scale-95 sm:flex"
            />
          </div>
          <AddToCartButton
            product={product}
            disabled={isOutOfStock}
            full
            className={cn(
              "mt-2 from-brand-primary-dark via-brand-primary to-brand-accent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg active:scale-[0.97]",
              !isOutOfStock && "btn-gradient-flow"
            )}
          />
        </div>
      </motion.div>
    </TiltCard>
  );
}
