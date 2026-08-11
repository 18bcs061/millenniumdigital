"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FolderKanban, PlusCircle, FileSpreadsheet, LogIn } from "lucide-react";
import { QuoteList } from "@/components/rfq/QuoteList";
import { useRfqStore } from "@/lib/stores/rfq-store";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

function BomLists() {
  const { status: authStatus } = useSession();
  const lists = useRfqStore((s) => s.bomLists);

  if (authStatus === "loading") return null;

  if (authStatus !== "authenticated") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
        <LogIn className="h-9 w-9 text-brand-primary" />
        <p className="font-heading text-lg font-bold text-slate-800">Sign in to view your BOM Lists</p>
        <Link href="/login" className="mt-1 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-bold text-white shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
        <FolderKanban className="h-9 w-9 text-slate-300" />
        <p className="font-heading text-lg font-bold text-slate-800">No Results Found</p>
        <p className="text-sm text-slate-500">Saved BOM projects will appear here.</p>
        <Link href="/rfq" className="mt-1 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-bold text-white shadow-md">
          Start with BOM
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lists.map((list) => (
        <div key={list.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 font-heading font-bold text-slate-900">
              <FileSpreadsheet className="h-4 w-4 text-brand-primary" /> {list.name}
            </p>
            <span className="text-xs text-slate-400">{formatDate(list.createdAt)}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {list.lineItems.map((li) => (
              <span key={li.id} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {li.partNumber} × {formatNumber(li.quantity)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BomListsPage() {
  const [tab, setTab] = useState<"bom" | "quotes">("quotes");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">BOM Lists & Quotes</h1>
          <p className="text-sm text-slate-500">Track submitted quotes and saved BOM projects.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/rfq" className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-sm font-bold text-white shadow-md">
            <PlusCircle className="h-4 w-4" /> Request New Quote
          </Link>
          <Link href="/rfq" className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-brand-primary">
            <FileSpreadsheet className="h-4 w-4" /> Start with BOM
          </Link>
        </div>
      </div>

      <div className="mb-5 flex gap-2 rounded-full border border-slate-200 bg-white p-1 w-fit">
        {(["quotes", "bom"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-bold transition",
              tab === t ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow" : "text-slate-500 hover:text-brand-primary"
            )}
          >
            {t === "quotes" ? "Quotes" : "BOM Lists"}
          </button>
        ))}
      </div>

      {tab === "quotes" ? <QuoteList /> : <BomLists />}
    </div>
  );
}
