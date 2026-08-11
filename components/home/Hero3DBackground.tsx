"use client";

import dynamic from "next/dynamic";
import { useWebglEnabled } from "@/lib/hooks/use-webgl-enabled";

const FabScene = dynamic(() => import("@/components/home/FabScene").then((m) => m.FabScene), {
  ssr: false,
});

/**
 * Live WebGL wafer-fab scene behind the hero — a silicon wafer with a real die grid
 * and yield map, a photolithography beam exposing it row by row, Manhattan-routed
 * interconnect, and a wire-bonded package. Falls back to the static gradient for
 * reduced-motion preferences or when WebGL is unavailable, so the hero never breaks.
 */
export function Hero3DBackground() {
  const enabled = useWebglEnabled();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {enabled && <FabScene />}
    </div>
  );
}
