"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Wallet, Package, Truck, FileText, Zap } from "lucide-react";
import { computeMonthlySeries, computeStats, type DashboardOrder } from "@/lib/dashboard";
import { getAllProducts } from "@/lib/catalog";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import { formatMoney } from "@/lib/currency";
import { useRfqStore } from "@/lib/stores/rfq-store";
import { DashboardHeader } from "@/components/account/DashboardHeader";
import { StatTile } from "@/components/account/StatTile";
import { SpendChart } from "@/components/account/SpendChart";
import { OrderActivityChart } from "@/components/account/OrderActivityChart";
import { LoyaltyJourneyCard } from "@/components/account/LoyaltyJourneyCard";
import { QuickActionsGrid } from "@/components/account/QuickActionsGrid";
import { RecommendedProducts } from "@/components/account/RecommendedProducts";
import { RecentOrdersCard } from "@/components/account/RecentOrdersCard";
import { EditProfileModal } from "@/components/account/EditProfileModal";
import { SectionHeader } from "@/components/account/SectionHeader";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const { currency } = useCurrencyStore();
  const rfqCount = useRfqStore((s) => s.quotes.length);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional loading flag before a data fetch
    setLoadingOrders(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoadingOrders(false));
  }, [status]);

  const series = useMemo(() => computeMonthlySeries(orders), [orders]);
  const stats = useMemo(() => computeStats(orders), [orders]);
  const recommended = useMemo(() => getAllProducts().filter((p) => p.isFeatured).slice(0, 4), []);

  if (status === "loading") {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-400">Loading...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
        <p className="font-heading text-xl font-extrabold text-slate-900">Sign in to view your dashboard</p>
        <Link href="/login" className="mt-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent px-5 py-2 text-sm font-bold text-white shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />

      <DashboardHeader
        name={user.name ?? "there"}
        loyaltyPoints={user.loyaltyPoints}
        totalOrders={stats.totalOrders}
        activeRfqs={rfqCount}
      />

      {loadingOrders ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-16 text-center text-slate-400">Loading your dashboard...</div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatTile label="Total Spent" value={formatMoney(stats.totalSpent, currency)} icon={Wallet} deltaPct={stats.spendDeltaPct} trend={series} />
              <StatTile label="Total Orders" value={String(stats.totalOrders)} icon={Package} />
              <StatTile label="Delivered" value={String(stats.deliveredCount)} icon={Truck} deltaGoodDirection="up" />
              <StatTile label="Active RFQs" value={String(rfqCount)} icon={FileText} />
            </div>

            <SpendChart data={series} />
            <OrderActivityChart data={series} />

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeader icon={Zap} title="Quick Actions" iconClassName="bg-brand-accent/10 text-brand-accent" />
              <QuickActionsGrid onEditProfile={() => setEditOpen(true)} />
            </div>

            <RecommendedProducts products={recommended} />
          </div>

          <div className="space-y-6">
            <LoyaltyJourneyCard loyaltyPoints={user.loyaltyPoints} />
            <RecentOrdersCard orders={orders} currency={currency} />
          </div>
        </div>
      )}
    </div>
  );
}
