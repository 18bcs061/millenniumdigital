import Link from "next/link";
import { FileSpreadsheet, Code2, ShoppingCart, SearchCheck, PackageSearch, Calculator, ArrowRight } from "lucide-react";

const TOOLS = [
  { icon: FileSpreadsheet, title: "BOM Tools", desc: "Upload or build a BOM and request bulk pricing.", href: "/tools/bom", gradient: "from-violet-600 to-fuchsia-500" },
  { icon: Code2, title: "API", desc: "Integrate search, cart, and order data into your apps.", href: "/tools/api", gradient: "from-cyan-500 to-blue-600" },
  { icon: ShoppingCart, title: "Cart", desc: "View and manage the items in your cart.", href: "/tools/cart", gradient: "from-emerald-500 to-teal-500" },
  { icon: SearchCheck, title: "Track Quote", desc: "Search and follow the status of your RFQs.", href: "/tools/track-quote", gradient: "from-amber-500 to-orange-500" },
  { icon: PackageSearch, title: "Product Assistance", desc: "Compare products, stock, and pricing side by side.", href: "/tools/product-assistance", gradient: "from-rose-500 to-pink-500" },
  { icon: Calculator, title: "Price Assistance", desc: "Model volume pricing and bulk discount tiers.", href: "/tools/price-assistance", gradient: "from-indigo-600 to-violet-500" },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Engineering & Procurement Toolkit</p>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">Tools</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">Everything you need to source, price, and track components at scale.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${tool.gradient} opacity-10 transition group-hover:scale-125 group-hover:opacity-20`} />
            <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-white shadow-md`}>
              <tool.icon className="h-6 w-6" />
            </div>
            <p className="relative mt-4 font-heading text-lg font-bold text-slate-900">{tool.title}</p>
            <p className="relative mt-1 text-sm text-slate-500">{tool.desc}</p>
            <span className="relative mt-3 flex items-center gap-1 text-sm font-bold text-brand-primary opacity-0 transition group-hover:opacity-100">
              Open Tool <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
