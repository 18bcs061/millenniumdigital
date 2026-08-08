"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CircuitScene = dynamic(() => import("@/components/home/CircuitScene").then((m) => m.CircuitScene), {
  ssr: false,
});

/**
 * Live WebGL "semiconductor circuit" scene behind the hero — glowing nodes, PCB-style
 * trace lines, and signal pulses. Falls back to a static gradient for reduced-motion
 * preferences or if WebGL isn't available, so the hero never breaks.
 */
export function Hero3DBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hasWebGL = false;
    try {
      const canvas = document.createElement("canvas");
      hasWebGL = !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      hasWebGL = false;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser capability check on mount
    setEnabled(!prefersReducedMotion && hasWebGL);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {enabled && <CircuitScene />}
    </div>
  );
}
