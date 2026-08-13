import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
  tone = "light",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  tone?: "light" | "dark";
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const emptyStar = tone === "dark" ? "fill-white/15 text-white/15" : "fill-slate-200 text-slate-200";
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn(starSize, i < Math.round(rating) ? "fill-brand-accent text-brand-accent" : emptyStar)} />
        ))}
      </div>
      <span className={cn("text-xs font-semibold", tone === "dark" ? "text-white/70" : "text-slate-500")}>
        {rating.toFixed(1)}
        {reviewCount !== undefined && (
          <span className={tone === "dark" ? "text-white/40" : "text-slate-400"}> ({reviewCount})</span>
        )}
      </span>
    </div>
  );
}
