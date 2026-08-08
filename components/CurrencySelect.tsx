"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { CURRENCIES } from "@/lib/currency";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { cn } from "@/lib/cn";

export function CurrencySelect({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = CURRENCIES.find((c) => c.code === currency)!;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-primary hover:text-brand-primary"
      >
        <span>{current.symbol}</span>
        <span>{current.code}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-brand-primary/5",
                c.code === currency && "bg-brand-primary/10 font-semibold text-brand-primary"
              )}
            >
              <span>
                {c.symbol} {c.code}
              </span>
              <span className="text-xs text-slate-400">{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
