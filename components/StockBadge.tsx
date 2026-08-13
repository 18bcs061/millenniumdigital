import { cn } from "@/lib/cn";

const STYLES: Record<string, { label: string; className: string; dot: string }> = {
  IN_STOCK: { label: "In Stock", className: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  LIMITED_STOCK: { label: "Limited Stock", className: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  OUT_OF_STOCK: { label: "Out of Stock", className: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
  BACKORDER: { label: "Backorder", className: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200", dot: "bg-fuchsia-500" },
};

export function StockBadge({
  availability,
  className,
  tone = "light",
}: {
  availability: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const style = STYLES[availability] ?? STYLES.IN_STOCK;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1",
        tone === "dark" ? "bg-white/8 text-white ring-white/15 backdrop-blur-sm" : style.className,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}
