import { QuoteList } from "@/components/rfq/QuoteList";

export default function TrackQuotePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <h1 className="mb-1 font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">Track Quote</h1>
      <p className="mb-6 text-sm text-slate-500">Search by Quote Number, Order Number, PO Number, or MPN.</p>
      <QuoteList />
    </div>
  );
}
