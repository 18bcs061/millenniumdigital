"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Search, PackageSearch, Calendar, Hash, ClipboardList } from "lucide-react";
import { CategoryArt } from "@/components/CategoryArt";
import { OrderStatusTimeline } from "@/components/orders/OrderStatusTimeline";
import { formatMoney } from "@/lib/currency";
import { useCurrencyStore } from "@/lib/stores/currency-store";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string; slug: string; sku: string; images: string[]; category: { slug: string } };
}
interface OrderRecord {
  id: string;
  orderNumber: string;
  status: string;
  poNumber: string | null;
  total: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_OPTIONS = ["", "PROCESSING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrdersPage() {
  const { status: authStatus } = useSession();
  const { currency } = useCurrencyStore();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional loading flag before a data fetch
    setLoading(true);
    fetch(`/api/orders?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }, [authStatus, q, status]);

  if (authStatus === "loading") {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-400">Loading...</div>;
  }

  if (authStatus !== "authenticated") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
        <ClipboardList className="h-10 w-10 text-brand-primary" />
        <p className="font-heading text-xl font-extrabold text-slate-900">Sign in to track your orders</p>
        <p className="text-sm text-slate-500">Search, filter, and follow every shipment from checkout to delivery.</p>
        <Link href="/login" className="mt-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-bold text-white shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">Order Details</h1>
        <p className="text-sm text-slate-500">Search and track every order placed on your account.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by order #, PO #, SKU, or product name..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s ? s.charAt(0) + s.slice(1).toLowerCase() : "All Statuses"}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center text-slate-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <PackageSearch className="h-10 w-10 text-slate-300" />
          <p className="font-heading text-lg font-bold text-slate-800">No orders found</p>
          <p className="text-sm text-slate-500">Try a different search term or place your first order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-slate-200 pb-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 font-heading font-bold text-slate-900">
                    <Hash className="h-4 w-4 text-brand-primary" /> {order.orderNumber}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="h-3.5 w-3.5" /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  {order.poNumber && <span className="text-slate-400">PO: {order.poNumber}</span>}
                </div>
                <span className="font-heading text-lg font-extrabold text-brand-primary">{formatMoney(order.total, currency)}</span>
              </div>

              <div className="py-4">
                <OrderStatusTimeline status={order.status} />
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <Link key={item.id} href={`/products/${item.product.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                      {item.product.images?.[0] ? (
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1" sizes="56px" />
                      ) : (
                        <CategoryArt categorySlug={item.product.category.slug} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-800">{item.product.name}</p>
                      <p className="text-xs text-slate-400">
                        SKU {item.product.sku} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{formatMoney(item.unitPrice * item.quantity, currency)}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
