"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layers, ScanLine, Boxes, Microscope, PackageCheck, CircuitBoard, ArrowRight } from "lucide-react";

/**
 * The six stages below follow the real front-to-back semiconductor flow —
 * ingot growth, photolithography, deposition/etch, wafer probe, assembly and
 * board bring-up — and each one is tied to something the visitor can actually
 * do here, so the story doubles as navigation.
 */
const STAGES = [
  {
    icon: Layers,
    stage: "Ingot & Wafer",
    spec: "300 mm Ø",
    body: "Monocrystalline silicon is pulled, sliced and polished into mirror-flat wafers.",
    tie: "Every part we list starts life here.",
    href: "/products?category=semiconductors",
    cta: "Semiconductors",
  },
  {
    icon: ScanLine,
    stage: "Photolithography",
    spec: "Sub-10 nm",
    body: "Deep-UV light prints circuit patterns through a mask, one reticle field at a time.",
    tie: "The same precision we apply to spec matching.",
    href: "/products",
    cta: "Search by spec",
  },
  {
    icon: Boxes,
    stage: "Deposition & Etch",
    spec: "15+ layers",
    body: "Conductors and insulators are grown, then etched away, building the stack layer by layer.",
    tie: "Six component families, stacked into one catalog.",
    href: "/products",
    cta: "All categories",
  },
  {
    icon: Microscope,
    stage: "Probe & Yield",
    spec: "100% tested",
    body: "Every die on the wafer is electrically probed and mapped — good from defective.",
    tie: "Authorised sourcing, traceable to the maker.",
    href: "/brands",
    cta: "Verified brands",
  },
  {
    icon: PackageCheck,
    stage: "Dice & Package",
    spec: "Wire-bond & BGA",
    body: "Wafers are singulated, dies bonded to a substrate and sealed into a package.",
    tie: "Reeled, trayed and ready to ship.",
    href: "/products",
    cta: "In-stock parts",
  },
  {
    icon: CircuitBoard,
    stage: "Onto Your Board",
    spec: "1 to 100K units",
    body: "Placed, reflowed and powered up in the product you are building right now.",
    tie: "Upload a BOM and we quote the whole build.",
    href: "/rfq",
    cta: "Start an RFQ",
  },
];

export function SiliconJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const railProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden bg-brand-navy py-16 text-white md:py-20">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-accent/15 blur-3xl" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-accent">The Silicon Journey</p>
          <h2 className="mt-2 font-heading text-2xl font-extrabold md:text-4xl">
            From sand to your board —<br className="hidden sm:block" /> we cover every step
          </h2>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            Most marketplaces start at the shopping cart. We start where the silicon does — because knowing how a part is
            made is how you source the right one.
          </p>
        </div>

        {/* Progress rail — fills as the section scrolls through the viewport. */}
        <div className="relative mt-12 hidden h-0.5 w-full bg-white/10 lg:block">
          <motion.div
            style={{ width: railProgress }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary-light"
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-3">
          {STAGES.map((s, i) => (
            <motion.div
              key={s.stage}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition hover:-translate-y-1 hover:border-brand-accent/50 hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-lg">
                    <s.icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="font-heading text-xs font-black text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-3 font-heading text-sm font-bold text-white">{s.stage}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-accent">{s.spec}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{s.body}</p>

                <p className="mt-3 border-t border-white/10 pt-3 text-xs font-semibold text-slate-300">{s.tie}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-accent">
                  {s.cta}
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
