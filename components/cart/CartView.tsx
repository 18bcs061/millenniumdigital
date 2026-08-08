"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { formatMoney } from "@/lib/currency";
import { CategoryArt } from "@/components/CategoryArt";
import { cn } from "@/lib/cn";

export function CartView({ variant = "page" }: { variant?: "page" | "drawer" }) {
  const { items, updateQuantity, removeItem, subtotalINR } = useCartStore();
  const { currency } = useCurrencyStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <ShoppingBag className="h-10 w-10 text-slate-300" />
        <p className="font-heading text-lg font-bold text-slate-800">Your cart is empty</p>
        <p className="text-sm text-slate-500">Browse the catalog and add components to get started.</p>
        <Link href="/products" className="mt-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", variant === "page" && "lg:flex-row lg:items-start")}>
      <div className="flex-1 space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <Link href={`/products/${item.product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                {item.product.images?.[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1" sizes="80px" />
                ) : (
                  <CategoryArt categorySlug={item.product.category?.slug ?? "sensors"} />
                )}
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${item.product.slug}`} className="line-clamp-1 font-heading text-sm font-bold text-slate-800 hover:text-brand-primary">
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-slate-400">{item.product.brand?.name} · SKU {item.product.sku}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-slate-200 px-1">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-heading text-sm font-bold text-brand-primary">
                    {formatMoney(item.product.priceINR * item.quantity, currency)}
                  </span>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="self-start rounded-full p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-80">
        <h3 className="font-heading text-lg font-bold text-slate-800">Order Summary</h3>
        <div className="mt-4 flex justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-700">{formatMoney(subtotalINR(), currency)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-slate-500">
          <span>Estimated Tax</span>
          <span className="font-semibold text-slate-700">{formatMoney(subtotalINR() * 0.18, currency)}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-dashed border-slate-200 pt-3 font-heading text-base font-bold text-slate-900">
          <span>Total</span>
          <span className="text-brand-primary">{formatMoney(subtotalINR() * 1.18, currency)}</span>
        </div>
        <button className="mt-5 w-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg">
          Proceed to Checkout
        </button>
        <Link href="/rfq" className="mt-2 block text-center text-xs font-semibold text-brand-primary hover:underline">
          Need a formal quote instead? Start an RFQ →
        </Link>
      </div>
    </div>
  );
}
