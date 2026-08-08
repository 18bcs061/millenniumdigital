"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { CategoryArt } from "@/components/CategoryArt";
import { cn } from "@/lib/cn";

export function ProductGallery({
  images,
  name,
  categorySlug,
}: {
  images: string[];
  name: string;
  categorySlug: string;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const hasImages = images.length > 0;

  function next() {
    setActive((a) => (a + 1) % Math.max(images.length, 1));
  }
  function prev() {
    setActive((a) => (a - 1 + images.length) % Math.max(images.length, 1));
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y });
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {hasImages && images.length > 1 && (
        <div className="flex shrink-0 gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition",
                active === i ? "border-brand-primary shadow-md" : "border-slate-200 opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      <div
        ref={frameRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoom({ x: 50, y: 50 })}
        onMouseLeave={() => setZoom(null)}
        className="group relative aspect-square flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {hasImages ? (
              <Image
                src={images[active]}
                alt={name}
                fill
                priority
                className="object-contain p-8 transition-transform duration-200"
                style={
                  zoom
                    ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : { transform: "scale(1)" }
                }
                sizes="(max-width: 768px) 100vw, 480px"
              />
            ) : (
              <CategoryArt categorySlug={categorySlug} className="p-10" />
            )}
          </motion.div>
        </AnimatePresence>

        {hasImages && (
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow">
            <ZoomIn className="h-4 w-4" />
          </div>
        )}

        {hasImages && images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow transition group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow transition group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn("h-1.5 rounded-full transition-all", active === i ? "w-5 bg-brand-primary" : "w-1.5 bg-slate-300")}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
