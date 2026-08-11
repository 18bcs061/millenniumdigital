"use client";

import { useEffect, useState } from "react";

/** True when the browser can render WebGL and the user hasn't asked for reduced motion. */
export function useWebglEnabled(): boolean {
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

  return enabled;
}
