import { Truck, ShieldCheck, Banknote, Headset, PackageCheck } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹2,000" },
  { icon: ShieldCheck, title: "Manufacturer Warranty", desc: "On every product listed" },
  { icon: Banknote, title: "Cash on Delivery", desc: "Available pan-India" },
  { icon: Headset, title: "Engineer Support", desc: "Real humans, real answers" },
  { icon: PackageCheck, title: "Verified Sourcing", desc: "Authorized distributor network" },
];

export function TrustStrip() {
  return (
    <section className="bg-brand-surface-alt py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:px-6 lg:grid-cols-5">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary/10">
              <item.icon className="h-5 w-5 text-brand-primary" />
            </div>
            <p className="font-heading text-sm font-bold text-slate-800">{item.title}</p>
            <p className="text-xs text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
