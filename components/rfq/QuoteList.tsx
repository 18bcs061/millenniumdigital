"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, FileSearch, Calendar, Hash, LogIn } from "lucide-react";
import { useRfqStore } from "@/lib/stores/rfq-store";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: "bg-slate-100 text-slate-600",
  PROCESSING: "bg-amber-50 text-amber-700",
  QUOTED: "bg-brand-secondary/10 text-brand-secondary",
  ORDERED: "bg-emerald-50 text-emerald-700",
};

const STATUS_OPTIONS = ["", "SUBMITTED", "PROCESSING", "QUOTED", "ORDERED"];

export function QuoteList() {
  const { status: authStatus } = useSession();
  const allQuotes = useRfqStore((s) => s.quotes);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const quotes = useMemo(() => {
    const term = q.trim().toLowerCase();
    return allQuotes
      .filter((quote) => !status || quote.status === status)
      .filter((quote) => !from || Date.parse(quote.createdAt) >= Date.parse(from))
      .filter((quote) => !to || Date.parse(quote.createdAt) <= Date.parse(to) + 86400000)
      .filter(
        (quote) =>
          !term ||
          quote.quoteNumber.toLowerCase().includes(term) ||
          quote.poNumber?.toLowerCase().includes(term) ||
          quote.lineItems.some((li) => li.partNumber.toLowerCase().includes(term))
      )
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [allQuotes, q, status, from, to]);

  if (authStatus === "loading") return null;

  if (authStatus !== "authenticated") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
        <LogIn className="h-9 w-9 text-brand-primary" />
        <p className="font-heading text-lg font-bold text-slate-800">Sign in to track your quotes</p>
        <p className="text-sm text-slate-500">Quote history is tied to your account for security.</p>
        <Link href="/login" className="mt-1 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-bold text-white shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Quote #, Order #, PO #, or MPN..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none">
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || "All Statuses"}</option>
          ))}
        </select>
        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-transparent outline-none" />
          <span className="text-slate-300">–</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-transparent outline-none" />
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <FileSearch className="h-9 w-9 text-slate-300" />
          <p className="font-heading text-lg font-bold text-slate-800">No Results Found</p>
          <p className="text-sm text-slate-500">Try adjusting your search or submit a new RFQ.</p>
          <Link href="/rfq" className="mt-1 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-bold text-white shadow-md">
            Request New Quote
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <div key={quote.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1.5 font-heading font-bold text-slate-900">
                    <Hash className="h-4 w-4 text-brand-primary" /> {quote.quoteNumber}
                  </span>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", STATUS_STYLES[quote.status])}>{quote.status}</span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(quote.createdAt)}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {quote.poNumber && <>PO: {quote.poNumber} · </>}
                {quote.country} · {quote.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {quote.lineItems.slice(0, 4).map((li) => (
                  <span key={li.id} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {li.partNumber} × {formatNumber(li.quantity)}
                  </span>
                ))}
                {quote.lineItems.length > 4 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-400">+{quote.lineItems.length - 4} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
