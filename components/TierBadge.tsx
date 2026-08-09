"use client";

import { motion } from "framer-motion";
import { Crown, Star, Sparkles } from "lucide-react";
import { getTierProgress } from "@/lib/tier";
import { cn } from "@/lib/cn";

const TIER_META = {
  Member: { icon: Sparkles, gradient: "from-slate-400 to-slate-500" },
  Preferred: { icon: Star, gradient: "from-brand-secondary to-brand-primary-light" },
  Premier: { icon: Crown, gradient: "from-brand-accent to-brand-primary" },
} as const;

export function TierBadge({
  loyaltyPoints,
  compact = false,
  className,
}: {
  loyaltyPoints: number;
  compact?: boolean;
  className?: string;
}) {
  const { tier, nextTier, pointsToNext, progress } = getTierProgress(loyaltyPoints);
  const { icon: Icon, gradient } = TIER_META[tier];

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-bold text-white shadow-sm",
          gradient,
          className
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {tier}
      </span>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1.5 text-sm font-bold text-white shadow", gradient)}>
          <Icon className="h-4 w-4" />
          {tier} Member
        </span>
        <span className="font-heading text-sm font-bold text-brand-primary">{loyaltyPoints.toLocaleString()} pts</span>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", gradient)}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {nextTier
          ? `${pointsToNext?.toLocaleString()} points to reach ${nextTier} — this quarter's engagement goal.`
          : "You've reached our top tier. Thank you for being a Premier member!"}
      </p>
    </div>
  );
}
