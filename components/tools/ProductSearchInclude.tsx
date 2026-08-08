"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, PlusCircle, Loader2 } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { CategoryArt } from "@/components/CategoryArt";

export function ProductSearchInclude({ onInclude }: { onInclude: (product: ProductListItem) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional loading flag before a data fetch
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(query)}&limit=6`)
        .then((r) => r.json())
        .then((data) => {
          setResults(data.products ?? []);
          setOpen(true);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-brand-primary">
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : <Search className="h-4 w-4 text-slate-400" />}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search for a product or part number to include..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {open && query.trim() && results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {results.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border-b border-slate-100 p-3 last:border-0 hover:bg-slate-50">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill className="object-contain p-0.5" sizes="40px" />
                ) : (
                  <CategoryArt categorySlug={p.category.slug} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-400">{p.brand.name} · SKU {p.sku}</p>
              </div>
              <button
                onClick={() => {
                  onInclude(p);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex shrink-0 items-center gap-1 rounded-full bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Include
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
