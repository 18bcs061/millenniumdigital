"use client";

import { Gift } from "lucide-react";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { formatMoney } from "@/lib/currency";

export function ProductPrice({ priceINR }: { priceINR: number }) {
  const { currency } = useCurrencyStore();
  const loyaltyPoints = Math.round(priceINR / 100);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2">
        <span className="font-heading text-3xl font-black text-brand-primary">{formatMoney(priceINR, currency)}</span>
        <span className="text-sm text-slate-400">+ 18% GST</span>
      </div>
      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-brand-accent">
        <Gift className="h-3.5 w-3.5" /> Earn {loyaltyPoints.toLocaleString()} loyalty points on this order
      </p>
    </div>
  );
}
