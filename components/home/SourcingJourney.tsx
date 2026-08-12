"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Boxes, SlidersHorizontal, ScanLine, ClipboardList, Truck, ArrowRight } from "lucide-react";

/**
 * The six stages below follow how a part actually reaches a customer through
 * a distributor — verified sourcing, live inventory, spec matching,
 * authentication, quoting and fulfillment — each tied to something the
 * visitor can actually do here, so the story doubles as navigation.
 */
const STAGES = [
  {
    icon: ShieldCheck,
    stage: "Verified Brands",
    spec: "500+ manufacturers",
    body: "We source directly from authorised manufacturers and franchised distributors — never gray market.",
    tie: "Every listing traces back to its maker.",
    href: "/brands",
    cta: "Verified brands",
  },
  {
    icon: Boxes,
    stage: "Live Inventory",
    spec: "100K+ SKUs",
    body: "Real stock across sensors, semiconductors, embedded boards, connectors, power and optoelectronics.",
    tie: "What you see is what's on the shelf.",
    href: "/products",
    cta: "Browse catalog",
  },
  {
    icon: SlidersHorizontal,
    stage: "Spec Matching",
    spec: "Search by parameter",
    body: "Filter by exact electrical, mechanical and package specs to find drop-in matches fast.",
    tie: "The same rigor engineers expect.",
    href: "/products",
    cta: "Search by spec",
  },
  {
    icon: ScanLine,
    stage: "Authenticated & Traceable",
    spec: "100% verified",
    body: "Every part is checked and lot-traceable back to the original manufacturer, no exceptions.",
    tie: "No counterfeits, ever.",
    href: "/brands",
    cta: "Our standards",
  },
  {
    icon: ClipboardList,
    stage: "BOM & RFQ",
    spec: "1 to 100K units",
    body: "Upload a BOM and get a line-by-line quote with lead times and bulk pricing.",
    tie: "From single prototypes to full production runs.",
    href: "/rfq",
    cta: "Start an RFQ",
  },
  {
    icon: Truck,
    stage: "Picked, Packed, Shipped",
    spec: "Order to dock",
    body: "Orders are pulled from stock, packed and shipped with full tracking end to end.",
    tie: "Track every order from PO to delivery.",
    href: "/orders",
    cta: "Track an order",
  },
];

export function SourcingJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const railProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden bg-brand-navy py-16 text-white md:py-20">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-accent/15 blur-3xl" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-accent">The Sourcing Journey</p>
          <h2 className="mt-2 font-heading text-2xl font-extrabold md:text-4xl">
            From verified brand to your dock —<br className="hidden sm:block" /> we cover every step
          </h2>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            Most marketplaces start at the shopping cart. We start at the source — verified brands, real inventory,
            and traceable parts — because knowing where a part comes from is how you source the right one.
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
