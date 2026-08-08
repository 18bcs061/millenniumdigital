"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { RatingStars } from "@/components/RatingStars";
import { staggerContainer, fadeUp } from "@/lib/motion";

const QUOTES = [
  {
    name: "Ananya R.",
    role: "Hardware Engineer",
    quote: "The cross-reference search saved me hours hunting for an equivalent sensor when our primary part went out of stock.",
    rating: 5,
  },
  {
    name: "Marcus T.",
    role: "Procurement Lead",
    quote: "RFQ/BOM upload is genuinely fast — dropped a 40-line BOM and had a quote back the same day.",
    rating: 5,
  },
  {
    name: "Devika S.",
    role: "Robotics Hobbyist",
    quote: "Love the compare feature for picking between motor drivers. The stock color-coding is a nice touch too.",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Loved by Makers & Buyers</p>
        <h2 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">What Our Customers Say</h2>
      </div>
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 md:grid-cols-3"
      >
        {QUOTES.map((q) => (
          <motion.div key={q.name} variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Quote className="h-6 w-6 text-brand-primary/30" />
            <p className="mt-2 text-sm leading-relaxed text-slate-600">&ldquo;{q.quote}&rdquo;</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-heading text-sm font-bold text-slate-900">{q.name}</p>
                <p className="text-xs text-slate-400">{q.role}</p>
              </div>
              <RatingStars rating={q.rating} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
