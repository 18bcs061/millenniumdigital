"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX, Maximize2, X, Boxes, ShieldCheck, Cpu, Truck } from "lucide-react";
import { cn } from "@/lib/cn";

interface ClipDef {
  id: string;
  src: string;
  title: string;
  desc: string;
  icon: typeof Boxes;
}

const CLIPS: ClipDef[] = [
  {
    id: "warehouse",
    src: "/videos/WhatsApp Video 2026-08-12 at 00.37.26.mp4",
    title: "Warehouse Operations",
    desc: "Real-time stock across every category, picked and packed the same day.",
    icon: Boxes,
  },
  {
    id: "testing",
    src: "/videos/WhatsApp Video 2026-08-12 at 00.41.37.mp4",
    title: "Component Testing",
    desc: "Every batch verified before it ever reaches your BOM.",
    icon: ShieldCheck,
  },
  {
    id: "engineering",
    src: "/videos/WhatsApp Video 2026-08-12 at 00.53.57.mp4",
    title: "Engineering Support",
    desc: "Our team validating builds and debugging designs, on camera.",
    icon: Cpu,
  },
  {
    id: "logistics",
    src: "/videos/WhatsApp Video 2026-08-12 at 00.53.59.mp4",
    title: "Dispatch & Logistics",
    desc: "From our dock to your bench — tracked at every step.",
    icon: Truck,
  },
];

/**
 * Real footage instead of stock imagery: a cinematic preview player paired with
 * a tabbed clip picker, plus a full-screen lightbox for the unmuted watch.
 */
export function VideoShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = CLIPS[activeIndex];

  function selectClip(i: number) {
    if (i === activeIndex) return;
    setActiveIndex(i);
    setMuted(true);
  }

  return (
    <section className="relative overflow-hidden bg-brand-navy py-16 md:py-20">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-primary/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-accent">Behind The Scenes</p>
          <h2 className="mt-2 font-heading text-2xl font-extrabold text-white md:text-4xl">Millennium Digital, In Motion</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 md:text-base">
            From the warehouse floor to your BOM — a real look at how every order comes together.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.video
                key={active.id}
                src={active.src}
                autoPlay
                loop
                muted={muted}
                playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="aspect-video w-full object-cover"
              />
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-accent">
                  <active.icon className="h-3.5 w-3.5" /> {active.title}
                </p>
                <p className="mt-1 max-w-sm text-sm text-slate-200">{active.desc}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                  aria-label="Watch full screen"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CLIPS.map((clip, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={clip.id}
                  onClick={() => selectClip(i)}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border p-3.5 text-left transition",
                    isActive
                      ? "border-transparent text-white"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="video-pill"
                      className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <clip.icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold">{clip.title}</span>
                  </span>
                  {isActive && (
                    <span className="relative mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-white/80">
                      <Play className="h-2.5 w-2.5 fill-current" /> Now Playing
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
              onClick={() => setLightboxOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[92vw] max-w-4xl -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative max-h-[80dvh] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                <video
                  key={`lightbox-${active.id}`}
                  src={active.src}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video max-h-[80dvh] w-full"
                />
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-white/80">
                {active.title} — {active.desc}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
