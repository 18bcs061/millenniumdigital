"use client";

import { useEffect, useRef } from "react";

/**
 * Looping brand video behind the hero. Muted + playsInline so mobile browsers
 * allow autoplay, and paused for reduced-motion preferences so the hero never
 * animates against the user's wishes.
 */
export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        src="/Hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        className="h-full w-full object-cover"
      />
    </div>
  );
}
