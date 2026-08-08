import { getBrands, getProductCountByBrand } from "@/lib/catalog";
import { BrandCard } from "@/components/BrandCard";
import { Award } from "lucide-react";

export const metadata = { title: "Brands — MillenniumDigital" };

export default function BrandsPage() {
  const brands = [...getBrands()].sort((a, b) => Number(b.isOfficial) - Number(a.isOfficial) || a.name.localeCompare(b.name));
  const counts = getProductCountByBrand();

  const official = brands.filter((b) => b.isOfficial);
  const others = brands.filter((b) => !b.isOfficial);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 animate-blob" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 rounded-full bg-white/10 animate-blob-delay" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold md:text-3xl">Our Trusted Brand Partners</h1>
            <p className="text-white/80">{brands.length}+ manufacturers, from global leaders to specialist makers.</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-extrabold text-slate-900">Official Partner Brands</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {official.map((b) => (
            <BrandCard key={b.id} brand={b} productCount={counts[b.slug] ?? 0} />
          ))}
        </div>
      </div>

      {others.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-heading text-xl font-extrabold text-slate-900">Also Available on MillenniumDigital</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((b) => (
              <BrandCard key={b.id} brand={b} productCount={counts[b.slug] ?? 0} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
