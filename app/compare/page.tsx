"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useCompareStore } from "@/lib/stores/compare-store";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { formatMoney } from "@/lib/currency";
import { getProductsByIds } from "@/lib/catalog";
import { CategoryArt } from "@/components/CategoryArt";
import { StockBadge } from "@/components/StockBadge";
import { RatingStars } from "@/components/RatingStars";
import { AddToCartButton } from "@/components/AddToCartButton";

export default function ComparePage() {
  const { productIds, remove } = useCompareStore();
  const { currency } = useCurrencyStore();
  const products = useMemo(() => getProductsByIds(productIds), [productIds]);

  if (productIds.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
        <Scale className="h-10 w-10 text-brand-primary" />
        <p className="font-heading text-xl font-extrabold text-slate-900">Nothing to compare yet</p>
        <p className="text-sm text-slate-500">Add up to 4 products from the catalog using the Compare button on any product card.</p>
        <Link href="/products" className="mt-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-bold text-white shadow-md">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="mb-6 flex items-center gap-2 font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">
        <Scale className="h-6 w-6 text-brand-primary" /> Compare Products ({products.length}/4)
      </h1>

      <div className="overflow-x-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(220px, 1fr))` }}>
          {products.map((p) => (
            <div key={p.id} className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <button onClick={() => remove(p.id)} className="absolute right-3 top-3 rounded-full p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                <X className="h-4 w-4" />
              </button>
              <Link href={`/products/${p.slug}`} className="relative mb-3 block aspect-square overflow-hidden rounded-xl bg-slate-50">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill className="object-contain p-4" sizes="220px" />
                ) : (
                  <CategoryArt categorySlug={p.category.slug} />
                )}
              </Link>
              <p className="line-clamp-2 font-heading text-sm font-bold text-slate-900">{p.name}</p>
              <p className="mb-2 text-xs text-slate-400">{p.brand.name}</p>
              <RatingStars rating={p.rating} reviewCount={p.reviewCount} />
              <p className="mt-2 font-heading text-lg font-extrabold text-brand-primary">{formatMoney(p.priceINR, currency)}</p>
              <div className="mt-2"><StockBadge availability={p.availability} /></div>
              <AddToCartButton product={p} disabled={p.availability === "OUT_OF_STOCK"} full className="mt-3" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <tbody>
            {["sku", "mpn", "countryOfOrigin", "warranty"].map((field) => (
              <tr key={field} className="border-b border-slate-100 last:border-0">
                <td className="w-40 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  {field === "mpn" ? "MPN" : field === "sku" ? "SKU" : field === "countryOfOrigin" ? "Country of Origin" : "Warranty"}
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-slate-700">
                    {(p as unknown as Record<string, string>)[field] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
