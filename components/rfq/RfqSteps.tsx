"use client";

import { motion } from "framer-motion";
import { ListPlus, Send, Cog, SearchCheck, PackageCheck } from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = [
  { label: "Add Parts to Form", icon: ListPlus },
  { label: "Submit the RFQ Form", icon: Send },
  { label: "Quote Processing", icon: Cog },
  { label: "Check Quote Status", icon: SearchCheck },
  { label: "Submit Order", icon: PackageCheck },
];

export function RfqSteps({ current = 0 }: { current?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {STEPS.map((step, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition",
              active ? "border-brand-primary bg-brand-primary/5 shadow-md" : done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                active ? "bg-gradient-to-br from-brand-primary to-brand-secondary text-white" : done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
              )}
            >
              <step.icon className="h-5 w-5" />
            </div>
            <p className={cn("text-xs font-bold", active ? "text-brand-primary" : done ? "text-emerald-600" : "text-slate-500")}>
              {i + 1}. {step.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
