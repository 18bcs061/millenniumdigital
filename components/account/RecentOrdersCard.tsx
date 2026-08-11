import Link from "next/link";
import { ArrowRight, Hash, ReceiptText } from "lucide-react";
import type { DashboardOrder } from "@/lib/dashboard";
import { formatMoney } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/currency";
import { formatDate } from "@/lib/format";
import { SectionHeader } from "@/components/account/SectionHeader";

const STATUS_STYLES: Record<string, string> = {
  PROCESSING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-brand-secondary/10 text-brand-secondary",
  SHIPPED: "bg-fuchsia-50 text-fuchsia-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-700",
};

export function RecentOrdersCard({ orders, currency }: { orders: DashboardOrder[]; currency: CurrencyCode }) {
  const recent = [...orders].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 4);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeader
        icon={ReceiptText}
        title="Recent Orders"
        action={
          <Link href="/orders" className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />
      <div className="space-y-2.5">
        {recent.map((order) => (
          <Link key={order.id} href="/orders" className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:border-brand-primary/30 hover:bg-brand-primary/5">
            <div>
              <p className="flex items-center gap-1 text-sm font-bold text-slate-800">
                <Hash className="h-3.5 w-3.5 text-slate-400" /> {order.orderNumber}
              </p>
              <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-brand-primary">{formatMoney(order.total, currency)}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLES[order.status] ?? "bg-slate-100 text-slate-600"}`}>{order.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
