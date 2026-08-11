"use client";

import { Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { MonthlyPoint } from "@/lib/dashboard";
import { SectionHeader } from "@/components/account/SectionHeader";

function ActivityTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="font-heading text-sm font-bold text-brand-primary">
        {payload[0].value} order{payload[0].value === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export function OrderActivityChart({ data }: { data: MonthlyPoint[] }) {
  const peakIndex = data.reduce((best, p, i) => (p.orders > (data[best]?.orders ?? 0) ? i : best), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeader icon={Activity} title="Order Activity" subtitle="Orders placed per month" />
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -28 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeWidth={1} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
            <Tooltip content={<ActivityTooltip />} cursor={{ fill: "rgba(155,27,92,0.06)" }} />
            <Bar dataKey="orders" radius={[4, 4, 0, 0]} maxBarSize={24}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === peakIndex ? "var(--color-accent)" : "var(--color-primary)"} fillOpacity={i === peakIndex ? 1 : 0.55} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
