import { notFound } from "next/navigation";
import { MapPin, Calendar, Sparkles } from "lucide-react";
import { getBrandBySlug, getProductsByBrandSlug } from "@/lib/catalog";
import { BrandLogo } from "@/components/BrandLogo";
import { ProductGrid } from "@/components/products/ProductGrid";

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const products = getProductsByBrandSlug(slug).sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 animate-blob" />
        <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="rounded-2xl bg-white p-2 shadow-lg">
            <BrandLogo name={brand.name} logoUrl={brand.logoUrl} size={72} />
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white/70">
              <Sparkles className="h-3.5 w-3.5" /> {brand.isOfficial ? "Official Partner Brand" : "Marketplace Brand"}
            </p>
            <h1 className="font-heading text-2xl font-extrabold md:text-3xl">{brand.name}</h1>
            <p className="mt-1 flex items-center gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {brand.countryOfOrigin}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Est. {brand.establishmentYear}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 font-heading text-lg font-bold text-slate-900">About {brand.name}</h2>
          <p className="leading-relaxed text-slate-600">{brand.description}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-brand-primary/5 p-6">
          <h2 className="mb-2 font-heading text-lg font-bold text-brand-primary">Why Choose {brand.name}</h2>
          <p className="leading-relaxed text-slate-700">{brand.whyChoose}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-extrabold text-slate-900">
          {products.length} Products from {brand.name}
        </h2>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
