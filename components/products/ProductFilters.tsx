"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { BrandLite } from "@/lib/types";
import { cn } from "@/lib/cn";

const PRICE_MAX = 50000;

export function ProductFilters({ brands }: { brands: BrandLite[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedBrands = searchParams.get("brands")?.split(",").filter(Boolean) ?? [];
  const inStockOnly = searchParams.get("inStock") === "1";
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? PRICE_MAX);

  function update(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleBrand(slug: string) {
    update((params) => {
      const set = new Set(selectedBrands);
      if (set.has(slug)) set.delete(slug);
      else set.add(slug);
      if (set.size) params.set("brands", Array.from(set).join(","));
      else params.delete("brands");
    });
  }

  const content = (
    <div className="space-y-6">
      <div>
        <p className="mb-3 flex items-center gap-1.5 font-heading text-sm font-extrabold text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-brand-primary" /> Filters
        </p>
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <span className="text-sm font-semibold text-slate-700">In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => update((params) => (inStockOnly ? params.delete("inStock") : params.set("inStock", "1")))}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Price Range (₹)</p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>₹{minPrice.toLocaleString()}</span>
          <span>–</span>
          <span>₹{maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={500}
          value={maxPrice}
          onChange={(e) => update((params) => params.set("maxPrice", e.target.value))}
          className="mt-2 w-full accent-[var(--color-primary)]"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Brands</p>
        <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label key={brand.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-brand-primary/5">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.slug)}
                onChange={() => toggleBrand(brand.slug)}
                className="h-3.5 w-3.5 accent-[var(--color-primary)]"
              />
              <span className="text-slate-700">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {(selectedBrands.length > 0 || inStockOnly || maxPrice < PRICE_MAX) && (
        <button
          onClick={() => router.push(pathname)}
          className="w-full rounded-full border border-slate-200 py-2 text-xs font-bold text-slate-500 hover:border-rose-300 hover:text-rose-500"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="mb-3 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </button>

      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <div className={cn("absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-2xl")}>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-heading font-extrabold">Filters</p>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
