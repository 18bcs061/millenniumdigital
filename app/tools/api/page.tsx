import Link from "next/link";
import { Code2, Search, ShoppingCart, ClipboardList, History, Headset, ArrowRight } from "lucide-react";

const APIS = [
  {
    icon: Search,
    title: "Search API",
    desc: "Query the full product catalog programmatically — by keyword, SKU, MPN, brand, or category — with structured JSON responses.",
  },
  {
    icon: ShoppingCart,
    title: "Cart API",
    desc: "Add, update, and remove cart line items directly from your own application or internal procurement tools.",
  },
  {
    icon: ClipboardList,
    title: "Order API",
    desc: "Programmatically place and manage orders, sync fulfillment status, and automate reordering workflows.",
  },
  {
    icon: History,
    title: "Order History API",
    desc: "Pull historical order and RFQ data for reporting, spend analysis, and supply-chain dashboards.",
  },
];

export default function ApiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 animate-blob" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white/70">Developer Platform</p>
            <h1 className="font-heading text-2xl font-extrabold md:text-3xl">MillenniumDigital APIs</h1>
          </div>
        </div>
        <p className="relative mt-4 max-w-2xl text-white/85">
          Your applications, enhanced with MillenniumDigital. Our REST APIs let you embed live catalog search, cart,
          order, and order-history data directly into your own procurement systems, ERPs, or internal tools —
          bringing production-grade sourcing workflows to whatever you&apos;re building.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {APIS.map((api) => (
          <div key={api.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10">
              <api.icon className="h-5 w-5 text-brand-primary" />
            </div>
            <p className="font-heading text-lg font-bold text-slate-900">{api.title}</p>
            <p className="flex-1 text-sm text-slate-500">{api.desc}</p>
            <button className="flex items-center gap-1 self-start text-sm font-bold text-brand-primary hover:underline">
              Learn More <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-brand-primary/30 bg-brand-primary/5 p-6 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <Headset className="h-8 w-8 text-brand-primary" />
          <div>
            <p className="font-heading font-bold text-slate-900">Need Help Getting Started?</p>
            <p className="text-sm text-slate-500">Our developer support team can help you scope integration and rate limits.</p>
          </div>
        </div>
        <Link href="/tools/product-assistance" className="shrink-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2.5 text-sm font-bold text-white shadow-md">
          Contact MillenniumDigital Now
        </Link>
      </div>
    </div>
  );
}
