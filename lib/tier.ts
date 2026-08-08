export type Tier = "Member" | "Preferred" | "Premier";

export const TIER_THRESHOLDS: Record<Tier, number> = {
  Member: 0,
  Preferred: 1000,
  Premier: 5000,
};

export function getTier(loyaltyPoints: number): Tier {
  if (loyaltyPoints >= TIER_THRESHOLDS.Premier) return "Premier";
  if (loyaltyPoints >= TIER_THRESHOLDS.Preferred) return "Preferred";
  return "Member";
}

export function getNextTier(tier: Tier): Tier | null {
  if (tier === "Member") return "Preferred";
  if (tier === "Preferred") return "Premier";
  return null;
}

/** Progress (0-1) toward the next tier, for progress bars/rings. */
export function getTierProgress(loyaltyPoints: number): {
  tier: Tier;
  nextTier: Tier | null;
  pointsIntoTier: number;
  pointsToNext: number | null;
  progress: number;
} {
  const tier = getTier(loyaltyPoints);
  const nextTier = getNextTier(tier);
  const floor = TIER_THRESHOLDS[tier];
  const ceiling = nextTier ? TIER_THRESHOLDS[nextTier] : null;

  if (!ceiling) {
    return { tier, nextTier, pointsIntoTier: loyaltyPoints - floor, pointsToNext: null, progress: 1 };
  }

  const pointsIntoTier = loyaltyPoints - floor;
  const span = ceiling - floor;
  return {
    tier,
    nextTier,
    pointsIntoTier,
    pointsToNext: ceiling - loyaltyPoints,
    progress: Math.min(1, pointsIntoTier / span),
  };
}
