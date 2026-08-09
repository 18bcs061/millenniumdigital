import { cn } from "@/lib/cn";

const PALETTES: Record<string, [string, string]> = {
  sensors: ["#9b1b5c", "#e0508c"],
  semiconductors: ["#6e1240", "#c9578f"],
  "embedded-solutions": ["#75787b", "#9b1b5c"],
  connectors: ["#e0508c", "#54575a"],
  power: ["#b83b71", "#e0508c"],
  optoelectronics: ["#9b1b5c", "#75787b"],
};

/**
 * Deterministic, colorful SVG illustration used when a product has no real photo,
 * so cards never render a blank/empty background.
 */
export function CategoryArt({ categorySlug, seed = 0, className }: { categorySlug: string; seed?: number; className?: string }) {
  const [c1, c2] = PALETTES[categorySlug] ?? ["#9b1b5c", "#e0508c"];
  const gradId = `cat-grad-${categorySlug}-${seed}`;
  const rotate = (seed % 5) * 6 - 12;

  return (
    <svg viewBox="0 0 200 200" className={cn("h-full w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gradId})`} opacity="0.14" />
      <g transform={`translate(100 100) rotate(${rotate})`}>
        <rect x="-46" y="-34" width="92" height="68" rx="10" fill={`url(#${gradId})`} opacity="0.9" />
        <rect x="-32" y="-20" width="64" height="40" rx="4" fill="white" opacity="0.18" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={-40 + i * 14} y="34" width="4" height="14" fill={c2} opacity="0.7" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={-40 + i * 14} y="-48" width="4" height="14" fill={c1} opacity="0.7" />
        ))}
        <circle cx="0" cy="0" r="10" fill="white" opacity="0.4" />
      </g>
    </svg>
  );
}
