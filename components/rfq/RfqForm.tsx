"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Send, MailCheck, CheckCircle2, HelpCircle, PhoneCall } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { useBomStore } from "@/lib/stores/bom-store";
import { useRfqStore } from "@/lib/stores/rfq-store";

export function RfqForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { rows, deleteAll } = useBomStore();
  const submitQuote = useRfqStore((s) => s.submitQuote);

  const [form, setForm] = useState({
    country: "India",
    contactName: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    code: "",
    poNumber: "",
    comment: "",
  });
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function sendCode() {
    setCodeSent(true);
    setCooldown(30);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    const validRows = rows.filter((r) => r.partNumber.trim());
    if (validRows.length === 0) {
      setResult({ ok: false, message: "Add at least one part to the BOM table above before submitting." });
      return;
    }
    if (codeSent && form.code.trim().length < 4) {
      setResult({ ok: false, message: "Enter the confirmation code sent to your email." });
      return;
    }

    setSubmitting(true);
    const quote = submitQuote({
      country: form.country,
      contactName: form.contactName,
      email: form.email,
      poNumber: form.poNumber || undefined,
      comment: form.comment || undefined,
      lineItems: validRows.map((r) => ({
        id: r.id,
        partNumber: r.partNumber,
        productInfo: r.productInfo,
        customerNumber: r.customerNumber,
        quantity: r.quantity,
        targetUnitPrice: r.targetUnitPrice ? Number(r.targetUnitPrice) || null : null,
        targetLeadTime: r.targetLeadTime,
        packaging: r.packaging,
      })),
    });
    setSubmitting(false);

    setResult({ ok: true, message: `Success! Your quote request ${quote.quoteNumber} has been submitted.` });
    deleteAll();
    setTimeout(() => router.push("/rfq/lists"), 1800);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-heading text-lg font-extrabold text-slate-900">Your Contact Details</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Country</label>
          <select
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Contact Name</label>
          <input
            required
            value={form.contactName}
            onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Confirmation Code</label>
          <div className="flex gap-2">
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder={codeSent ? "Enter code" : "Send code first"}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
            />
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={sendCode}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-brand-primary/30 bg-brand-primary/5 px-3 py-2.5 text-xs font-bold text-brand-primary disabled:opacity-50"
            >
              {codeSent ? <MailCheck className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
              {cooldown > 0 ? `Resend (${cooldown}s)` : "Send Code"}
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">PO No. (optional)</label>
          <input
            value={form.poNumber}
            onChange={(e) => setForm((f) => ({ ...f, poNumber: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Comment</label>
        <textarea
          rows={3}
          value={form.comment}
          onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
          placeholder="Tell us about your project, target price, or delivery timeline..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
        />
      </div>

      {result && (
        <p className={`flex items-center gap-1.5 text-sm font-semibold ${result.ok ? "text-emerald-600" : "text-rose-500"}`}>
          {result.ok && <CheckCircle2 className="h-4 w-4" />} {result.message}
        </p>
      )}

      <button
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {submitting ? "Submitting..." : "Submit RFQ"}
      </button>

      <div className="flex flex-wrap gap-4 border-t border-dashed border-slate-200 pt-3 text-xs font-semibold">
        <Link href="/tools" className="flex items-center gap-1.5 text-brand-primary hover:underline">
          <HelpCircle className="h-3.5 w-3.5" /> FAQ
        </Link>
        <Link href="/tools/product-assistance" className="flex items-center gap-1.5 text-brand-secondary hover:underline">
          <PhoneCall className="h-3.5 w-3.5" /> Contact Us
        </Link>
      </div>
    </form>
  );
}
