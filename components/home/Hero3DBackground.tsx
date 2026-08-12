"use client";

import dynamic from "next/dynamic";
import { useWebglEnabled } from "@/lib/hooks/use-webgl-enabled";

const CircuitBoardScene = dynamic(
  () => import("@/components/home/CircuitBoardScene").then((m) => m.CircuitBoardScene),
  { ssr: false }
);

/**
 * Live WebGL scene behind the hero — a populated, glossy circuit board carrying
 * the kind of parts Millennium actually distributes (ICs, connectors, capacitors,
 * resistors), lit by neon pink/cyan traces with pulses racing along them. Falls
 * back to the static gradient for reduced-motion preferences or when WebGL is
 * unavailable, so the hero never breaks.
 */
export function Hero3DBackground() {
  const enabled = useWebglEnabled();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {enabled && <CircuitBoardScene />}
    </div>
  );
}
