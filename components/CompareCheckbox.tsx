"use client";

import { Scale } from "lucide-react";
import { useCompareStore, MAX_COMPARE } from "@/lib/stores/compare-store";
import { cn } from "@/lib/cn";

export function CompareCheckbox({
  productId,
  className,
  tone = "light",
}: {
  productId: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const has = useCompareStore((s) => s.has(productId));
  const toggle = useCompareStore((s) => s.toggle);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const result = toggle(productId);
        if (result.limitReached) {
          alert(`You can compare up to ${MAX_COMPARE} products at a time. Remove one to add another.`);
        }
      }}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
        has
          ? tone === "dark"
            ? "border-brand-accent bg-brand-accent/15 text-brand-accent"
            : "border-brand-primary bg-brand-primary/10 text-brand-primary"
          : tone === "dark"
            ? "border-white/15 text-white/60 hover:border-brand-accent hover:text-brand-accent"
            : "border-slate-200 text-slate-500 hover:border-brand-primary hover:text-brand-primary",
        className
      )}
    >
      <Scale className="h-3.5 w-3.5" />
      Compare
    </button>
  );
}
