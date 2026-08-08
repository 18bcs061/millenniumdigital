import { Check, PackageX } from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = ["PROCESSING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;
const LABELS: Record<(typeof STEPS)[number], string> = {
  PROCESSING: "Processing",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export function OrderStatusTimeline({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
        <PackageX className="h-4 w-4" /> This order was cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status as (typeof STEPS)[number]);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition",
                  done ? "bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-md" : "bg-slate-100 text-slate-400"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-[11px] font-semibold", done ? "text-slate-800" : "text-slate-400")}>{LABELS[step]}</span>
            </div>
            {!isLast && <div className={cn("mx-1 h-1 flex-1 rounded-full transition", i < currentIndex ? "bg-gradient-to-r from-brand-primary to-brand-secondary" : "bg-slate-100")} />}
          </div>
        );
      })}
    </div>
  );
}
