import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function RatingStars({ rating, reviewCount, size = "sm" }: { rating: number; reviewCount?: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(starSize, i < Math.round(rating) ? "fill-brand-accent text-brand-accent" : "fill-slate-200 text-slate-200")}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-500">
        {rating.toFixed(1)}
        {reviewCount !== undefined && <span className="text-slate-400"> ({reviewCount})</span>}
      </span>
    </div>
  );
}
