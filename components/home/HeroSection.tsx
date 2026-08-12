"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Cpu, Radio, Zap } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { Hero3DBackground } from "@/components/home/Hero3DBackground";

const FLOATING_CHIPS = [
  { icon: Cpu, label: "100K+ SKUs", className: "left-[5%] top-[16%]", delay: 0 },
  { icon: Radio, label: "IoT Ready", className: "right-[6%] top-[12%]", delay: 0.4 },
  { icon: Zap, label: "Bulk RFQ", className: "left-[9%] bottom-[14%]", delay: 0.8 },
];

export function HeroSection({ stats }: { stats: { products: number; brands: number; categories: number } }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <section className="relative min-h-[680px] overflow-hidden bg-brand-navy py-20 text-white">
      <Hero3DBackground />
      {/* Scrim shaped to the copy block, so the board and components stay visible at the edges. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_50%_46%,rgba(26,14,20,0.94),rgba(26,14,20,0.55)_58%,rgba(26,14,20,0.15)_78%,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-brand-navy" />
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-primary blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-accent blur-3xl animate-blob" />
      </div>

      {FLOATING_CHIPS.map((chip) => (
        <motion.div
          key={chip.label}
          className={`absolute z-10 hidden items-center gap-1.5 rounded-full glass-dark px-3 py-1.5 text-xs font-bold text-white shadow-lg lg:flex ${chip.className}`}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: chip.delay, ease: "easeInOut" }}
        >
          <chip.icon className="h-3.5 w-3.5 text-brand-accent" /> {chip.label}
        </motion.div>
      ))}

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-4xl px-4 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-accent ring-1 ring-white/20"
        >
          The Next-Gen Electronics Marketplace
        </motion.span>

        <motion.h1 variants={fadeUp} className="mt-5 font-heading text-4xl font-black leading-tight md:text-6xl">
          Source Every Component,
          <br />
          <span className="gradient-text bg-gradient-to-r from-brand-accent to-brand-primary-light">From Prototype to Production</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
          Sensors, semiconductors, embedded solutions, connectors, power, and optoelectronics — with RFQ/BOM tools built for engineers and procurement teams alike.
        </motion.p>

        <motion.form
          variants={fadeUp}
          onSubmit={(e) => {
            e.preventDefault();
            router.push(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : "/products");
          }}
          className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-2xl"
        >
          <Search className="ml-3 h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parts, MPNs, sensors, boards..."
            className="w-full bg-transparent px-2 py-2 text-sm text-slate-800 outline-none"
          />
          <button className="rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg">
            Search
          </button>
        </motion.form>

        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/products" className="flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20">
            Browse Catalog <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/rfq" className="flex items-center gap-1.5 rounded-full bg-brand-accent px-5 py-2.5 text-sm font-bold text-brand-navy shadow-md transition hover:brightness-110">
            Start a Bulk RFQ <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-4">
          {[
            { label: "Products", value: "100K+" },
            { label: "Brands", value: `${stats.brands}+` },
            { label: "Categories", value: `${stats.categories}` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl glass-dark p-4">
              <p className="font-heading text-2xl font-black text-brand-accent">{s.value}</p>
              <p className="text-xs text-slate-300">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
