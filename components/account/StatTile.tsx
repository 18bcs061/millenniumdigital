"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/cn";

export interface StatTileProps {
  label: string;
  value: string;
  icon: LucideIcon;
  deltaPct?: number | null;
  deltaGoodDirection?: "up" | "down";
  trend?: { label: string; amount: number }[];
}

export function StatTile({ label, value, icon: Icon, deltaPct, deltaGoodDirection = "up", trend }: StatTileProps) {
  const hasDelta = deltaPct !== undefined && deltaPct !== null && Number.isFinite(deltaPct);
  const isUp = hasDelta && deltaPct! >= 0;
  const isGood = hasDelta && (deltaGoodDirection === "up" ? isUp : !isUp);

  return (
    <TiltCard intensity={7} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10">
          <Icon className="h-4.5 w-4.5 text-brand-primary" />
        </div>
        {hasDelta && (
          <span className={cn("flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold", isGood ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(deltaPct!).toFixed(0)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-500">{label}</p>
      <p className="font-heading text-2xl font-black text-slate-900">{value}</p>

      {trend && trend.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-70">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={2} fill={`url(#spark-${label})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </TiltCard>
  );
}
