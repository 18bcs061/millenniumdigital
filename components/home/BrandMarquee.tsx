import Link from "next/link";
import type { BrandLite } from "@/lib/types";
import { BrandLogo } from "@/components/BrandLogo";

export function BrandMarquee({ brands }: { brands: BrandLite[] }) {
  const loop = [...brands, ...brands];

  return (
    <section className="border-y border-slate-200 bg-brand-surface-alt py-12">
      <p className="mx-auto mb-6 max-w-7xl px-4 text-center text-xs font-bold uppercase tracking-wider text-brand-primary md:px-6">
        Trusted Brand Partners
      </p>
      <div className="no-scrollbar relative overflow-hidden">
        <div className="flex w-max animate-marquee gap-6 px-6">
          {loop.map((brand, i) => (
            <Link
              key={`${brand.id}-${i}`}
              href={`/brands/${brand.slug}`}
              className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm transition hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-xl"
            >
              <BrandLogo name={brand.name} logoUrl={brand.logoUrl} size={56} />
              <span className="font-heading text-base font-extrabold text-slate-800">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
