import type { ProductListItem } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/cn";

const DEFAULT_ROW_SIZE = 20;
// Base durations behind .animate-marquee-slow / -reverse in globals.css.
const BASE_DURATION = 46;
const BASE_DURATION_REVERSE = 52;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/** One infinitely-looping row. Pauses on hover so a card can actually be clicked. */
function ReelRow({ products, reverse, speed }: { products: ProductListItem[]; reverse: boolean; speed: number }) {
  const loop = [...products, ...products];
  const duration = (reverse ? BASE_DURATION_REVERSE : BASE_DURATION) * speed;

  return (
    <div className="group/marquee marquee-fade relative">
      <div
        className={cn(
          "flex w-max gap-5 px-6 [animation-play-state:running] group-hover/marquee:[animation-play-state:paused]",
          reverse ? "animate-marquee-slow-reverse" : "animate-marquee-slow"
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((product, i) => (
          <div key={`${product.id}-${i}`} className="w-56 shrink-0 sm:w-64">
            <ProductCard product={product} view="grid" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * One or more infinitely-looping rows of ProductCards (up to `rowSize` cards
 * per row, alternating scroll direction). `panel` controls the backdrop:
 * - true (default) paints its own dark "stage" — for homepage/showcase
 *   contexts where the reel is the whole visual feature.
 * - false renders just the rows, no background — the cards already carry
 *   their own glow, so this drops straight onto a page's existing
 *   background instead of boxing itself in, which is what reads as a
 *   screen dropped onto the page when sat next to a light sidebar/chrome.
 */
export function ProductReel({
  products,
  rowSize = DEFAULT_ROW_SIZE,
  className,
  speed = 1,
  panel = true,
}: {
  products: ProductListItem[];
  rowSize?: number;
  className?: string;
  /** Duration multiplier — 1 is the default pace, 2 runs at half speed (twice the duration). */
  speed?: number;
  panel?: boolean;
}) {
  if (products.length === 0) return null;
  const rows = chunk(products, rowSize);

  return (
    <div
      className={cn(
        "relative w-full min-w-0 overflow-hidden",
        panel && "bg-gradient-to-br from-brand-navy via-[#170b12] to-black",
        className
      )}
    >
      {panel && (
        <>
          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-brand-accent/15 blur-3xl" />
        </>
      )}
      <div className={cn("relative flex flex-col gap-6", panel ? "py-8" : "py-2")}>
        {rows.map((row, i) => (
          <ReelRow key={i} products={row} reverse={i % 2 === 1} speed={speed} />
        ))}
      </div>
    </div>
  );
}
