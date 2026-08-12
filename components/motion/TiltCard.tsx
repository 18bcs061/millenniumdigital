"use client";

import { useRef, type PropsWithChildren } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { computeTilt } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function TiltCard({
  children,
  className,
  intensity = 8,
}: PropsWithChildren<{ className?: string; intensity?: number }>) {
  const ref = useRef<HTMLDivElement>(null);
  // Motion values rather than state: mouse-move writes straight to the transform
  // instead of re-rendering the whole card subtree on every pointer event.
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className={cn("card-3d", className)}
      style={{ transformPerspective: 1000, rotateX, rotateY }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const tilt = computeTilt(e, ref.current, intensity);
        rotateX.set(tilt.rotateX);
        rotateY.set(tilt.rotateY);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
