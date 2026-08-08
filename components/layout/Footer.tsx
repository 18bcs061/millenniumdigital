import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Brands", href: "/brands" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Compare", href: "/compare" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "RFQ / BOM Quote", href: "/rfq" },
      { label: "BOM Lists & Quotes", href: "/rfq/lists" },
      { label: "Order Tracking", href: "/orders" },
      { label: "Tools", href: "/tools" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Overview", href: "/tools/api" },
      { label: "Product Assistance", href: "/tools/product-assistance" },
      { label: "Price Assistance", href: "/tools/price-assistance" },
      { label: "Track Quote", href: "/tools/track-quote" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-brand shadow-lg">
                <span className="font-heading text-lg font-black text-white">M</span>
              </div>
              <p className="font-heading text-lg font-extrabold text-white">MillenniumDigital</p>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              A next-generation electronics marketplace for sensors, semiconductors, embedded solutions, connectors, power, and optoelectronics — built for makers and enterprise buyers alike.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-accent" /> support@millenniumdigital.com</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-accent" /> +1 (800) 555-0142</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-accent" /> Wilmington, DE, USA</p>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-heading text-sm font-bold uppercase tracking-wider text-white">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-400 transition hover:text-brand-accent">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-accent" /> © {new Date().getFullYear()} MillenniumDigital. All rights reserved.
          </p>
          <p>Built with Next.js · A showcase marketplace demo</p>
        </div>
      </div>
    </footer>
  );
}
