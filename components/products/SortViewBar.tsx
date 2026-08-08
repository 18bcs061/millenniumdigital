"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/cn";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest Arrivals" },
];

export function SortViewBar({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { view, setView } = useUiStore();
  const sort = searchParams.get("sort") ?? "relevance";

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-sm text-slate-500">
        <span className="font-heading font-extrabold text-slate-900">{resultCount}</span> products found
      </p>
      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 rounded-full border border-slate-200 p-1">
          <button
            onClick={() => setView("grid")}
            className={cn("rounded-full p-1.5 transition", view === "grid" ? "bg-brand-primary text-white" : "text-slate-400 hover:text-brand-primary")}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("rounded-full p-1.5 transition", view === "list" ? "bg-brand-primary text-white" : "text-slate-400 hover:text-brand-primary")}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
