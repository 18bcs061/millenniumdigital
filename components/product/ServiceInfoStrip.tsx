import Link from "next/link";
import { PackagePlus, Headset, ShieldCheck, Truck, Banknote } from "lucide-react";

const ITEMS = [
  { icon: PackagePlus, label: "Bulk Order", desc: "Volume pricing via RFQ", href: "/rfq" },
  { icon: Headset, label: "Need Support", desc: "Talk to an engineer", href: "/tools" },
  { icon: ShieldCheck, label: "Warranty", desc: "Manufacturer backed", href: "#" },
  { icon: Truck, label: "Free Delivery", desc: "On orders above ₹2,000", href: "#" },
  { icon: Banknote, label: "Cash on Delivery", desc: "Available pan-India", href: "#" },
];

export function ServiceInfoStrip() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-md"
        >
          <item.icon className="h-5 w-5 text-brand-primary" />
          <p className="text-xs font-bold text-slate-800">{item.label}</p>
          <p className="text-[10px] text-slate-400">{item.desc}</p>
        </Link>
      ))}
    </div>
  );
}
