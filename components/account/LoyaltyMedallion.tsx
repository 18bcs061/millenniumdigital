"use client";

import dynamic from "next/dynamic";
import { Crown, Star, Sparkles } from "lucide-react";
import { useWebglEnabled } from "@/lib/hooks/use-webgl-enabled";
import type { Tier } from "@/lib/tier";

const LoyaltyMedallionScene = dynamic(() => import("@/components/account/LoyaltyMedallionScene").then((m) => m.LoyaltyMedallionScene), {
  ssr: false,
});

const TIER_ICON: Record<Tier, typeof Sparkles> = { Member: Sparkles, Preferred: Star, Premier: Crown };

/** Live rotating 3D medallion for the loyalty tier; falls back to a flat badge icon without WebGL. */
export function LoyaltyMedallion({ tier, size = 140 }: { tier: Tier; size?: number }) {
  const enabled = useWebglEnabled();
  const Icon = TIER_ICON[tier];

  return (
    <div style={{ width: size, height: size }} className="relative">
      {enabled ? (
        <LoyaltyMedallionScene tier={tier} />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full gradient-brand shadow-xl">
          <Icon className="h-10 w-10 text-white" />
        </div>
      )}
    </div>
  );
}
