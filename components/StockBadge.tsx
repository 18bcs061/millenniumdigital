import { cn } from "@/lib/cn";

const STYLES: Record<string, { label: string; className: string; dot: string }> = {
  IN_STOCK: { label: "In Stock", className: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  LIMITED_STOCK: { label: "Limited Stock", className: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  OUT_OF_STOCK: { label: "Out of Stock", className: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
  BACKORDER: { label: "Backorder", className: "bg-violet-50 text-violet-700 ring-violet-200", dot: "bg-violet-500" },
};

export function StockBadge({ availability, className }: { availability: string; className?: string }) {
  const style = STYLES[availability] ?? STYLES.IN_STOCK;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1", style.className, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}
