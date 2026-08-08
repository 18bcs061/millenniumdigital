import Link from "next/link";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import type { BrandLite } from "@/lib/types";
import { BrandLogo } from "@/components/BrandLogo";
import { TiltCard } from "@/components/motion/TiltCard";

export function BrandCard({ brand, productCount }: { brand: BrandLite; productCount?: number }) {
  return (
    <TiltCard>
      <Link
        href={`/brands/${brand.slug}`}
        className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-primary/40 hover:shadow-xl"
      >
        <div className="flex items-center gap-3">
          <BrandLogo name={brand.name} logoUrl={brand.logoUrl} size={52} />
          <div>
            <p className="flex items-center gap-1 font-heading text-base font-extrabold text-slate-900">
              {brand.name}
              {brand.isOfficial && <span className="rounded-full bg-brand-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-brand-primary">OFFICIAL</span>}
            </p>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3 w-3" /> {brand.countryOfOrigin}
              <span className="mx-0.5">·</span>
              <Calendar className="h-3 w-3" /> Est. {brand.establishmentYear}
            </p>
          </div>
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-slate-500">{brand.whyChoose}</p>
        <div className="flex items-center justify-between text-sm">
          {productCount !== undefined && <span className="font-semibold text-brand-secondary">{productCount} products</span>}
          <span className="ml-auto flex items-center gap-1 font-bold text-brand-primary opacity-0 transition group-hover:opacity-100">
            Explore <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
