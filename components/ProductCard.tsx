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
  // Alternates the glow tint pink/cyan per card, echoing the hero circuit board.
  const isCyan = seed % 2 === 0;
  const glowColor = isCyan ? "bg-sky-400/30" : "bg-brand-accent/30";
  const glowColorHover = isCyan ? "bg-sky-400/25" : "bg-brand-accent/25";
  const ringHover = isCyan ? "group-hover:border-sky-400/50" : "group-hover:border-brand-accent/50";
  const shadowHover = isCyan
    ? "group-hover:shadow-[0_20px_50px_-16px_rgba(56,189,248,0.45)]"
    : "group-hover:shadow-[0_20px_50px_-16px_rgba(224,80,140,0.5)]";

  if (view === "list") {
    return (
      <motion.div
        layout
        className="group relative flex gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-navy via-[#170b12] to-black p-4 shadow-[0_6px_24px_-16px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-0.5"
      >
        <div className={cn("pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300", ringHover)} />
        <Link
          href={`/products/${product.slug}`}
          className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_35%,#241221_0%,#150a10_60%,#05070a_100%)]"
        >
          <span className={cn("pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl", glowColor)} />
          <ProductMedia product={product} />
          {showHot && <Sticker variant="hot" className="absolute left-1 top-1">🔥 Hot</Sticker>}
          {showNew && <Sticker variant="new" className="absolute left-1 top-1">✨ New</Sticker>}
        </Link>
        <div className="relative flex flex-1 flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">{product.category.name}</p>
              <Link href={`/products/${product.slug}`} className="font-heading text-base font-bold text-white hover:text-brand-accent">
                {product.name}
              </Link>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
                <BadgeCheck className="h-3.5 w-3.5 text-brand-accent" /> {product.brand.name} · SKU {product.sku}
              </p>
            </div>
            <WishlistButton product={product} tone="dark" />
          </div>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} tone="dark" />
          <p className="line-clamp-1 text-sm text-white/50">{product.description}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-extrabold text-brand-accent">{formatMoney(product.priceINR, currency)}</span>
              <StockBadge availability={product.availability} tone="dark" />
            </div>
            <div className="flex items-center gap-2">
              <CompareCheckbox productId={product.id} tone="dark" />
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
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-navy via-[#170b12] to-black shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)] transition-[border-color,box-shadow,transform] duration-300 ease-out group-hover:-translate-y-1.5",
          ringHover,
          shadowHover
        )}
      >
        {/* Holographic sweeps + edge glow, all purely decorative. The idle layers
            are offset per card (seeded, so it stays stable across renders) to keep
            the grid from pulsing in unison. */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            isCyan ? "bg-gradient-to-br from-sky-400/10 via-transparent to-brand-primary/10" : "bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-primary/10"
          )}
        />
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-2xl">
          <span className="card-ambient-sheen" style={{ animationDelay: `${ambientDelay}s` }} />
          <span className="card-shine" />
        </div>
        <span className="card-edge-line pointer-events-none z-30" style={{ animationDelay: `${ambientDelay * 0.6}s` }} />

        <Link
          href={`/products/${product.slug}`}
          className="relative z-10 block aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#241221_0%,#150a10_60%,#05070a_100%)]"
        >
          {/* Glow behind the part: breathes on its own, brightens on hover. */}
          <span
            className={cn("animate-glow-breathe pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 rounded-full blur-3xl", glowColor)}
            style={{ animationDelay: `${ambientDelay * 0.45}s` }}
          />
          <span
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
              glowColorHover
            )}
          />
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
            tone="dark"
            className="absolute right-2 top-2 z-10 transition duration-300 group-hover:scale-110"
          />

          {/* Slides up from the bottom edge of the photo on hover. */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center gap-1 bg-gradient-to-t from-black/90 to-transparent py-2.5 text-xs font-bold text-white transition-transform duration-300 ease-out group-hover:translate-y-0">
            View Details <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <div className="relative z-10 flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70 ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-white/12">
              <span className={cn("h-1 w-1 rounded-full", isCyan ? "bg-sky-400" : "bg-brand-accent")} />
              {product.category.name}
            </span>
            <StockBadge availability={product.availability} tone="dark" className="scale-90" />
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 font-heading text-sm font-bold leading-snug text-white transition-colors duration-200 hover:text-brand-accent"
          >
            {product.name}
          </Link>
          <p className="flex items-center gap-1 text-xs text-white/40 transition-colors duration-300 group-hover:text-white/60">
            <BadgeCheck className="h-3.5 w-3.5 text-brand-accent transition-transform duration-300 group-hover:rotate-12" />
            {product.brand.name}
          </p>
          <div className="transition-transform duration-300 group-hover:translate-x-0.5">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} tone="dark" />
          </div>

          {/* Hairline that picks up the glow colour as the card is hovered. */}
          <div
            className={cn(
              "mt-1 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-colors duration-500",
              isCyan ? "group-hover:via-sky-400/50" : "group-hover:via-brand-accent/50"
            )}
          />

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="font-heading text-lg font-extrabold tabular-nums text-brand-accent transition-all duration-300 group-hover:scale-105">
              {formatMoney(product.priceINR, currency)}
            </span>
            <CompareCheckbox
              productId={product.id}
              tone="dark"
              className="hidden transition-all duration-200 hover:scale-105 active:scale-95 sm:flex"
            />
          </div>
          <AddToCartButton
            product={product}
            disabled={isOutOfStock}
            full
            className={cn(
              "mt-2 from-brand-primary-dark via-brand-primary to-brand-accent transition-all duration-300 group-hover:-translate-y-0.5 active:scale-[0.97]",
              isCyan
                ? "group-hover:shadow-[0_10px_30px_-10px_rgba(56,189,248,0.6)]"
                : "group-hover:shadow-[0_10px_30px_-10px_rgba(224,80,140,0.6)]",
              !isOutOfStock && "btn-gradient-flow"
            )}
          />
        </div>
      </motion.div>
    </TiltCard>
  );
}
