"use client";

import Image from "next/image";
import { Trash2, PackageSearch } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { CategoryArt } from "@/components/CategoryArt";
import { StockBadge } from "@/components/StockBadge";
import { calculateLineTotal } from "@/lib/pricing";
import { formatMoney } from "@/lib/currency";
import { useCurrencyStore } from "@/lib/stores/currency-store";

export interface IncludedItem {
  product: ProductListItem;
  quantity: number;
}

export function AssistanceTable({
  items,
  onQuantityChange,
  onRemove,
}: {
  items: IncludedItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  const { currency } = useCurrencyStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
        <PackageSearch className="h-9 w-9 text-slate-300" />
        <p className="font-heading text-lg font-bold text-slate-800">No products included yet</p>
        <p className="text-sm text-slate-500">Search above and click &ldquo;Include&rdquo; to start comparing pricing.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Product / Part Number</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Unit Price</th>
            <th className="px-4 py-3">Bulk Discount</th>
            <th className="px-4 py-3">Total After Discount</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map(({ product, quantity }) => {
            const { discount, total } = calculateLineTotal(product.priceINR, quantity);
            return (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-contain p-0.5" sizes="40px" />
                      ) : (
                        <CategoryArt categorySlug={product.category.slug} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => onQuantityChange(product.id, Math.max(1, Number(e.target.value)))}
                    className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-primary"
                  />
                </td>
                <td className="px-4 py-3"><StockBadge availability={product.availability} /></td>
                <td className="px-4 py-3 font-semibold text-slate-700">{formatMoney(product.priceINR, currency)}</td>
                <td className="px-4 py-3">
                  {discount > 0 ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{(discount * 100).toFixed(0)}% off</span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-heading font-bold text-brand-primary">{formatMoney(total, currency)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onRemove(product.id)} className="rounded-full p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
