"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileSpreadsheet, Crown, Wrench } from "lucide-react";
import { staggerContainer, fadeUp } from "@/lib/motion";

const BANNERS = [
  {
    icon: FileSpreadsheet,
    title: "Bulk RFQ / BOM Upload",
    desc: "Upload a parts list and get production-volume quotes fast.",
    href: "/rfq",
    gradient: "from-violet-600 to-fuchsia-500",
  },
  {
    icon: Crown,
    title: "Member → Preferred → Premier",
    desc: "Earn loyalty points on every order and unlock better perks.",
    href: "/account",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Wrench,
    title: "Engineering Tools Suite",
    desc: "Price assistance, product assistance, APIs, and quote tracking.",
    href: "/tools",
    gradient: "from-cyan-500 to-blue-600",
  },
];

export function PromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {BANNERS.map((b) => (
          <motion.div key={b.title} variants={fadeUp}>
            <Link
              href={b.href}
              className={`group relative block overflow-hidden rounded-2xl bg-gradient-to-br ${b.gradient} p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 transition group-hover:scale-125" />
              <b.icon className="h-8 w-8" />
              <p className="mt-4 font-heading text-lg font-extrabold">{b.title}</p>
              <p className="mt-1 text-sm text-white/85">{b.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
