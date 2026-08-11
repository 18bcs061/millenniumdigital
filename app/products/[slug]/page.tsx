import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, BadgeCheck, Info, PackageX } from "lucide-react";
import { getProductBySlug, getFilteredProducts, getReviewsForProduct, getQuestionsForProduct } from "@/lib/catalog";
import { RatingStars } from "@/components/RatingStars";
import { StockBadge } from "@/components/StockBadge";
import { BrandLogo } from "@/components/BrandLogo";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPrice } from "@/components/product/ProductPrice";
import { ProductActions } from "@/components/product/ProductActions";
import { ServiceInfoStrip } from "@/components/product/ServiceInfoStrip";
import { NotFoundHelp } from "@/components/product/NotFoundHelp";
import { ProductInfoTabs } from "@/components/product/ProductInfoTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { formatNumber } from "@/lib/format";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getFilteredProducts({ category: product.category.slug }).filter((p) => p.id !== product.id).slice(0, 4);
  const seededReviews = getReviewsForProduct(product.id);
  const seededQuestions = getQuestionsForProduct(product.id);

  const isOutOfStock = product.availability === "OUT_OF_STOCK";
  const isBackorder = product.availability === "BACKORDER";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="mb-4 flex flex-wrap items-center gap-1 text-xs text-slate-500">
        <Link href="/products" className="hover:text-brand-primary">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-primary">{product.category.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-700">{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} categorySlug={product.category.slug} />

        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-secondary">{product.category.name}</p>
            <h1 className="mt-1 font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
              <span className="text-xs text-slate-400">SKU: {product.sku}</span>
              {product.mpn && <span className="text-xs text-slate-400">MPN: {product.mpn}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            <BrandLogo name={product.brand.name} logoUrl={product.brand.logoUrl} size={44} />
            <div>
              <p className="font-heading text-sm font-bold text-slate-800">{product.brand.name}</p>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <BadgeCheck className="h-3.5 w-3.5 text-brand-primary" /> {product.brand.whyChoose}
              </p>
            </div>
            <Link href={`/brands/${product.brand.slug}`} className="ml-auto text-xs font-bold text-brand-primary hover:underline">
              View Brand
            </Link>
          </div>

          <ProductPrice priceINR={product.priceINR} />

          <div className="flex flex-wrap items-center gap-2">
            <StockBadge availability={product.availability} />
            {isOutOfStock && (
              <span className="flex items-center gap-1 text-xs font-semibold text-rose-500">
                <PackageX className="h-3.5 w-3.5" /> Currently unavailable — join the restock alert list.
              </span>
            )}
            {isBackorder && <span className="text-xs font-semibold text-brand-primary">Ships in 3-4 weeks on backorder.</span>}
            {!isOutOfStock && !isBackorder && <span className="text-xs text-slate-400">{formatNumber(product.stockQty)} units available</span>}
          </div>

          <ProductActions product={product} disabled={isOutOfStock} />

          <div className="rounded-xl bg-brand-accent/10 p-3 text-sm text-amber-800">
            <Info className="mr-1.5 inline h-4 w-4" />
            Need 1,000+ units? <Link href="/rfq" className="font-bold underline">Contact our bulk order desk</Link> for volume pricing and dedicated lead-time support.
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-200 p-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">MPN</p>
              <p className="font-semibold text-slate-800">{product.mpn ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Brand</p>
              <p className="font-semibold text-slate-800">{product.brand.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Category</p>
              <p className="font-semibold text-slate-800">{product.category.name}</p>
            </div>
          </div>

          <ServiceInfoStrip />
          <NotFoundHelp />
        </div>
      </div>

      <div className="mt-10">
        <ProductInfoTabs
          productId={product.id}
          description={product.description}
          features={product.features}
          packageIncludes={product.packageIncludes}
          specifications={product.specifications}
          warranty={product.warranty}
          countryOfOrigin={product.countryOfOrigin}
          initialReviews={seededReviews}
          initialQuestions={seededQuestions}
        />
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-heading text-xl font-extrabold text-slate-900">More from {product.category.name}</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
