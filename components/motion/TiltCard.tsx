"use client";

import { useRef, useState, type PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { computeTilt } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function TiltCard({
  children,
  className,
  intensity = 8,
}: PropsWithChildren<{ className?: string; intensity?: number }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  return (
    <motion.div
      ref={ref}
      className={cn("card-3d", className)}
      style={{ transformPerspective: 1000 }}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        setTilt(computeTilt(e, ref.current, intensity));
      }}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
    >
      {children}
    </motion.div>
  );
}
