"use client";

import { useState } from "react";
import type { ProductListItem } from "@/lib/types";
import { ProductSearchInclude } from "@/components/tools/ProductSearchInclude";
import { AssistanceTable, type IncludedItem } from "@/components/tools/AssistanceTable";
import { CurrencySelect } from "@/components/CurrencySelect";
import { calculateLineTotal } from "@/lib/pricing";
import { formatMoney } from "@/lib/currency";
import { useCurrencyStore } from "@/lib/stores/currency-store";

export function AssistanceTool({ title, description }: { title: string; description: string }) {
  const [items, setItems] = useState<IncludedItem[]>([]);
  const { currency } = useCurrencyStore();

  function include(product: ProductListItem) {
    setItems((prev) => (prev.some((i) => i.product.id === product.id) ? prev : [...prev, { product, quantity: 1 }]));
  }
  function setQuantity(productId: string, quantity: number) {
    setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)));
  }
  function remove(productId: string) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  const grandTotal = items.reduce((sum, i) => sum + calculateLineTotal(i.product.priceINR, i.quantity).total, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">{title}</h1>
          <p className="max-w-xl text-sm text-slate-500">{description}</p>
        </div>
        <CurrencySelect />
      </div>

      <div className="mb-5">
        <ProductSearchInclude onInclude={include} />
      </div>

      <AssistanceTable items={items} onQuantityChange={setQuantity} onRemove={remove} />

      {items.length > 0 && (
        <div className="mt-4 flex justify-end">
          <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 px-6 py-4 text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Grand Total After Discounts</p>
            <p className="font-heading text-2xl font-black text-brand-primary">{formatMoney(grandTotal, currency)}</p>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
        Bulk discount tiers: <span className="font-semibold text-slate-700">5% off above 5,000 units</span>,{" "}
        <span className="font-semibold text-slate-700">10% off above 10,000 units</span>,{" "}
        <span className="font-semibold text-slate-700">16% off above 20,000 units</span>.
      </div>
    </div>
  );
}
