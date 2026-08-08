"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CategoryLite } from "@/lib/types";
import { CategoryVisual } from "@/components/home/CategoryVisual";
import { TiltCard } from "@/components/motion/TiltCard";
import { staggerContainer, fadeUp } from "@/lib/motion";

export function CategoryShowcase({ categories }: { categories: (CategoryLite & { _count: { products: number } })[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Shop by Category</p>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">Six Categories, Endless Builds</h2>
        </div>
        <Link href="/products" className="hidden items-center gap-1 text-sm font-bold text-brand-primary hover:underline sm:flex">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
      >
        {categories.map((cat, i) => (
          <motion.div key={cat.id} variants={fadeUp}>
            <TiltCard>
              <Link href={`/products?category=${cat.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-primary/40 hover:shadow-xl">
                <div className="relative aspect-square overflow-hidden" style={{ perspective: 800 }}>
                  <motion.div
                    className="h-full w-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{
                      rotateY: [0, 10, 0, -10, 0],
                      rotateX: [0, -5, 0, 5, 0],
                      y: [0, -4, 0, 4, 0],
                    }}
                    transition={{ duration: 7 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  >
                    <CategoryVisual categorySlug={cat.slug} name={cat.name} />
                  </motion.div>
                </div>
                <div className="p-3">
                  <p className="font-heading text-sm font-bold text-slate-900">{cat.name}</p>
                  <p className="text-xs text-slate-400">{cat._count.products} products</p>
                </div>
              </Link>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
