"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, FileText } from "lucide-react";
import { TierBadge } from "@/components/TierBadge";
import { useWebglEnabled } from "@/lib/hooks/use-webgl-enabled";
import { formatDate } from "@/lib/format";

const DashboardOrbitScene = dynamic(() => import("@/components/account/DashboardOrbitScene").then((m) => m.DashboardOrbitScene), {
  ssr: false,
});

export function DashboardHeader({
  name,
  loyaltyPoints,
  totalOrders,
  activeRfqs,
}: {
  name: string;
  loyaltyPoints: number;
  totalOrders: number;
  activeRfqs: number;
}) {
  const firstName = name.split(" ")[0];
  const [today, setToday] = useState<string | null>(null);
  const webglEnabled = useWebglEnabled();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- current date must be read client-side to avoid SSR/client mismatch
    setToday(formatDate(new Date(), { weekday: "long", month: "long", day: "numeric" }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-brand-primary/5 p-6 shadow-sm md:p-7"
    >
      <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-brand-accent/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent opacity-40 blur-md" />
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent text-2xl font-black text-white shadow-lg">
              {firstName[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">{today ?? " "}</p>
            <h1 className="font-heading text-2xl font-black text-slate-900 md:text-3xl">
              Hi {firstName}, welcome back! <span className="inline-block animate-sticker">👋</span>
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <TierBadge loyaltyPoints={loyaltyPoints} compact />
              <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                <Package className="h-3.5 w-3.5" /> {totalOrders} orders
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                <FileText className="h-3.5 w-3.5" /> {activeRfqs} active RFQs
              </span>
            </div>
          </div>
        </div>

        <div className="relative hidden h-36 w-48 shrink-0 sm:block">{webglEnabled && <DashboardOrbitScene />}</div>
      </div>
    </motion.div>
  );
}
