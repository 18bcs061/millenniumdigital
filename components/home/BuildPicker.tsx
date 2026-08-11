"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Bot, BatteryCharging, Cpu, Factory, Lightbulb, ArrowRight, FileSpreadsheet } from "lucide-react";
import type { CategoryLite } from "@/lib/types";
import { cn } from "@/lib/cn";

type CategoryWithCount = CategoryLite & { _count: { products: number } };

/**
 * Component catalogues normally make you already know the category you want.
 * Engineers think in builds instead — so this asks what they are making and
 * resolves that straight into the right component families.
 */
const BUILDS = [
  {
    id: "iot",
    icon: Radio,
    label: "IoT Sensor Node",
    blurb: "Battery-backed wireless nodes that read the physical world and report home.",
    slugs: ["sensors", "embedded-solutions", "power"],
  },
  {
    id: "robotics",
    icon: Bot,
    label: "Robotics & Motion",
    blurb: "Closed-loop motion — drivers, feedback sensing and the logic that ties them together.",
    slugs: ["sensors", "semiconductors", "power", "connectors"],
  },
  {
    id: "power",
    icon: BatteryCharging,
    label: "Power Supply",
    blurb: "Conversion and regulation stages, from mains front-end to point-of-load.",
    slugs: ["power", "semiconductors", "connectors"],
  },
  {
    id: "prototype",
    icon: Cpu,
    label: "Dev Board Prototype",
    blurb: "Get a proof-of-concept breadboarded and blinking before committing to a spin.",
    slugs: ["embedded-solutions", "connectors", "optoelectronics"],
  },
  {
    id: "industrial",
    icon: Factory,
    label: "Industrial Control",
    blurb: "Rugged sensing and switching built to survive a factory floor for a decade.",
    slugs: ["sensors", "semiconductors", "connectors", "power"],
  },
  {
    id: "display",
    icon: Lightbulb,
    label: "LED & Display",
    blurb: "Emitters, drivers and the thermal headroom to run them at full brightness.",
    slugs: ["optoelectronics", "power", "semiconductors"],
  },
];

export function BuildPicker({ categories }: { categories: CategoryWithCount[] }) {
  const [activeId, setActiveId] = useState(BUILDS[0].id);
  const active = BUILDS.find((b) => b.id === activeId) ?? BUILDS[0];

  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const needed = active.slugs.map((slug) => bySlug.get(slug)).filter((c): c is CategoryWithCount => Boolean(c));
  const totalParts = needed.reduce((sum, c) => sum + c._count.products, 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="mb-7 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Start Here</p>
        <h2 className="mt-1 font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">What are you building?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          Skip the category maze. Tell us the project and we&apos;ll line up the exact component families it needs.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {BUILDS.map((build) => {
          const isActive = build.id === activeId;
          return (
            <button
              key={build.id}
              onClick={() => setActiveId(build.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition",
                isActive
                  ? "border-transparent text-white shadow-lg"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-primary/40 hover:text-brand-primary"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="build-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <build.icon className="relative h-4 w-4" />
              <span className="relative">{build.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-brand-primary/5 p-6 shadow-sm md:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-lg">
                  <active.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-heading text-lg font-extrabold text-slate-900">{active.label}</p>
                  <p className="text-xs font-bold text-brand-primary">
                    {needed.length} component families · {totalParts} parts in stock
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{active.blurb}</p>

              <Link
                href="/rfq"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-primary hover:text-brand-primary"
              >
                <FileSpreadsheet className="h-4 w-4" /> Quote this whole build
              </Link>
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:max-w-xl">
              {needed.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.06 * i }}
                >
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-md"
                  >
                    <div>
                      <p className="font-heading text-sm font-bold text-slate-900">{cat.name}</p>
                      <p className="text-xs text-slate-400">{cat._count.products} products</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-primary" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
