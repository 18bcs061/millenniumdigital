"use client";

import { motion } from "framer-motion";
import { Crown, Star, Sparkles } from "lucide-react";
import { getTierProgress } from "@/lib/tier";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

const TIER_META = {
  Member: {
    icon: Sparkles,
    gradient: "from-slate-400 to-slate-500",
    wash: "from-slate-50 to-white",
    text: "text-slate-600",
  },
  Preferred: {
    icon: Star,
    gradient: "from-brand-secondary to-brand-primary-light",
    wash: "from-brand-secondary/10 via-white to-white",
    text: "text-brand-secondary",
  },
  Premier: {
    icon: Crown,
    gradient: "from-brand-accent to-brand-primary",
    wash: "from-brand-accent/15 via-brand-primary/5 to-white",
    text: "text-brand-primary",
  },
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
  const meta = TIER_META[tier];
  const Icon = meta.icon;

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-bold text-white shadow-sm",
          meta.gradient,
          className
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {tier}
      </span>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br p-4 shadow-sm", meta.wash, className)}>
      <div className={cn("pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-25 blur-2xl", meta.gradient)} />
      <div className={cn("pointer-events-none absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-15 blur-2xl", meta.gradient)} />

      <div className="relative flex items-center gap-3">
        <motion.span
          initial={{ scale: 0.75, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className={cn("relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg", meta.gradient)}
        >
          <Icon className="h-5 w-5" />
          {tier === "Premier" && (
            <motion.span
              className="absolute inset-0 rounded-xl ring-2 ring-brand-accent/50"
              animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.35, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{tier} Member</p>
          <p className="font-heading text-xl font-extrabold leading-tight text-slate-900">
            {formatNumber(loyaltyPoints)} <span className="text-xs font-bold text-slate-400">pts</span>
          </p>
        </div>
      </div>

      <div className="relative mt-3.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
          <motion.div
            className={cn("relative h-full overflow-hidden rounded-full bg-gradient-to-r", meta.gradient)}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.span
              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
        <p className="mt-2 text-xs leading-snug text-slate-500">
          {nextTier ? (
            <>
              <span className={cn("font-bold", meta.text)}>{formatNumber(pointsToNext ?? 0)} points</span> to reach {nextTier} — this quarter&apos;s engagement goal.
            </>
          ) : (
            "You've reached our top tier. Thank you for being a Premier member!"
          )}
        </p>
      </div>
    </div>
  );
}
