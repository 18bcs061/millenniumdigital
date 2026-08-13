import { getFilteredProducts, getFilterOptions, getCrossReferenceSuggestions, parseProductSearchParams } from "@/lib/catalog";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductFilters } from "@/components/products/ProductFilters";
import { SortViewBar } from "@/components/products/SortViewBar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { BomBanner } from "@/components/products/BomBanner";
import { CompareTray } from "@/components/products/CompareTray";
import { CrossReferenceSuggestions } from "@/components/products/CrossReferenceSuggestions";

export const metadata = { title: "Products — MillenniumDigital" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseProductSearchParams(sp);
  const [products, { categories, brands }] = await Promise.all([getFilteredProducts(filters), getFilterOptions()]);

  const suggestions = filters.q ? await getCrossReferenceSuggestions(filters, products.map((p) => p.id)) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="mb-6">
        <BomBanner />
      </div>

      <div className="mb-5">
        <CategoryTabs categories={categories} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ProductFilters brands={brands} />

        <div className="min-w-0 flex-1 space-y-5">
          <SortViewBar resultCount={products.length} />
          <ProductGrid products={products} />
          {filters.q && <CrossReferenceSuggestions query={filters.q} products={suggestions} />}
        </div>
      </div>

      <CompareTray />
    </div>
  );
}
