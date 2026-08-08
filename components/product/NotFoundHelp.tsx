import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";

export function NotFoundHelp() {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <HelpCircle className="h-4 w-4 text-brand-primary" /> Didn&apos;t find what you were looking for?
      </p>
      <Link href="/rfq" className="flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
        Request a custom quote <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
