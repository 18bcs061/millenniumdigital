"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { LoyaltyMedallion } from "@/components/account/LoyaltyMedallion";
import { getTierProgress, TIER_THRESHOLDS, type Tier } from "@/lib/tier";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

const STOPS: Tier[] = ["Member", "Preferred", "Premier"];

export function LoyaltyJourneyCard({ loyaltyPoints }: { loyaltyPoints: number }) {
  const { tier, progress, nextTier, pointsToNext } = getTierProgress(loyaltyPoints);
  const currentIndex = STOPS.indexOf(tier);
  const overallProgress = Math.min(1, (currentIndex + progress) / (STOPS.length - 1));

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-brand p-6 text-white shadow-xl">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 animate-blob" />
      <div className="pointer-events-none absolute -bottom-14 left-0 h-32 w-32 rounded-full bg-white/10 animate-blob-delay" />

      <p className="relative text-xs font-bold uppercase tracking-wider text-white/70">Loyalty Journey</p>

      <div className="relative mt-3 flex justify-center">
        <LoyaltyMedallion tier={tier} size={128} />
      </div>

      <div className="relative mt-2 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-bold backdrop-blur">
          {tier} Member
        </span>
        <p className="mt-1.5 font-heading text-2xl font-black">{formatNumber(loyaltyPoints)} pts</p>
      </div>

      <div className="relative mt-6">
        <div className="flex items-center justify-between">
          {STOPS.map((stop, i) => (
            <div key={stop} className="flex flex-col items-center gap-1.5" style={{ width: 64 }}>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition",
                  i <= currentIndex ? "border-white bg-white text-brand-primary" : "border-white/30 bg-white/10 text-white/60"
                )}
              >
                {i < currentIndex ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <p className={cn("text-[10px] font-semibold", i <= currentIndex ? "text-white" : "text-white/50")}>{stop}</p>
            </div>
          ))}
        </div>
        <div className="relative mt-[-30px] mb-6 h-1 overflow-hidden rounded-full bg-white/20" style={{ marginInline: 32 }}>
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <p className="relative text-center text-xs text-white/80">
        {nextTier ? (
          <>
            <span className="font-bold">{formatNumber(pointsToNext ?? 0)} points</span> to reach {nextTier} — this quarter&apos;s engagement goal
          </>
        ) : (
          "You've reached Premier — thank you for being a top member!"
        )}
      </p>

      <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-4 text-center text-[10px] text-white/70">
        {STOPS.map((stop) => (
          <div key={stop}>
            <p className="font-bold text-white">{formatNumber(TIER_THRESHOLDS[stop])}+</p>
            <p>{stop}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
