"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileSpreadsheet, ArrowRight, Zap } from "lucide-react";

export function BomBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl gradient-brand p-5 text-white shadow-lg"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 animate-blob" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-white/10 animate-blob-delay" />
      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <p className="font-heading text-lg font-extrabold">Bulk Ordering with BOM/RFQ</p>
            <p className="text-sm text-white/80">Upload a parts list and get production-volume pricing in minutes.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold sm:flex">
            <Zap className="h-3.5 w-3.5 text-brand-accent" /> Up to 16% volume discount
          </span>
          <Link
            href="/rfq"
            className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-primary shadow-md transition hover:scale-105"
          >
            Start a BOM Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
