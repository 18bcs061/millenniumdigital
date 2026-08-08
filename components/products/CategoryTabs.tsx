"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import type { CategoryLite } from "@/lib/types";
import { cn } from "@/lib/cn";

export function CategoryTabs({ categories }: { categories: CategoryLite[] }) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  function hrefFor(slug?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  const tabs = [{ slug: undefined, name: "All Products" }, ...categories];

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const isActive = tab.slug === active || (!tab.slug && !active);
        return (
          <Link key={tab.slug ?? "all"} href={hrefFor(tab.slug)} className="relative shrink-0">
            <span
              className={cn(
                "relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition",
                isActive ? "text-white" : "text-slate-600 hover:text-brand-primary"
              )}
            >
              {!tab.slug && <LayoutGrid className="h-3.5 w-3.5" />}
              {tab.name}
            </span>
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary shadow-md"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {!isActive && <span className="absolute inset-0 rounded-full border border-slate-200" />}
          </Link>
        );
      })}
    </div>
  );
}
