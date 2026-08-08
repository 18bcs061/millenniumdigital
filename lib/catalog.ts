import categoriesData from "@/data/categories.json";
import brandsData from "@/data/brands.json";
import productsData from "@/data/products.json";
import reviewsData from "@/data/reviews.json";
import questionsData from "@/data/questions.json";
import type { BrandLite, CategoryLite, ProductDetail } from "@/lib/types";

export interface SeededReview {
  id: string;
  productId: string;
  userId: string | null;
  authorName: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
}

export interface SeededQuestion {
  id: string;
  productId: string;
  userId: string | null;
  authorName: string;
  question: string;
  answer: string | null;
  createdAt: string;
}

const categories = categoriesData as CategoryLite[];
const brands = brandsData as BrandLite[];
const reviews = reviewsData as SeededReview[];
const questions = questionsData as SeededQuestion[];

const categoryById = new Map(categories.map((c) => [c.id, c]));
const brandById = new Map(brands.map((b) => [b.id, b]));

interface RawProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  mpn: string | null;
  brandId: string;
  categoryId: string;
  priceINR: number;
  description: string;
  features: string[];
  packageIncludes: string[];
  specifications: Record<string, string>;
  countryOfOrigin: string;
  availability: ProductDetail["availability"];
  stockQty: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isFeatured: boolean;
  warranty: string;
  createdAt: string;
}

const products: ProductDetail[] = (productsData as unknown as RawProduct[]).map((p): ProductDetail => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  sku: p.sku,
  mpn: p.mpn,
  priceINR: p.priceINR,
  description: p.description,
  countryOfOrigin: p.countryOfOrigin,
  availability: p.availability,
  stockQty: p.stockQty,
  rating: p.rating,
  reviewCount: p.reviewCount,
  images: p.images,
  isFeatured: p.isFeatured,
  warranty: p.warranty,
  createdAt: p.createdAt,
  features: p.features,
  packageIncludes: p.packageIncludes,
  specifications: p.specifications,
  brand: brandById.get(p.brandId)!,
  category: categoryById.get(p.categoryId)!,
}));

export function getCategories(): CategoryLite[] {
  return categories;
}

export function getBrands(): BrandLite[] {
  return brands;
}

export function getBrandBySlug(slug: string): BrandLite | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getCategoryBySlug(slug: string): CategoryLite | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category.slug] = (counts[p.category.slug] ?? 0) + 1;
  return counts;
}

export function getProductCountByBrand(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.brand.slug] = (counts[p.brand.slug] ?? 0) + 1;
  return counts;
}

export function getAllProducts(): ProductDetail[] {
  return products;
}

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): ProductDetail | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByIds(ids: string[]): ProductDetail[] {
  const set = new Set(ids);
  return products.filter((p) => set.has(p.id));
}

export function getProductsByBrandSlug(slug: string): ProductDetail[] {
  return products.filter((p) => p.brand.slug === slug);
}

export interface ProductFilters {
  q?: string;
  category?: string;
  brands?: string[];
  ids?: string[];
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "relevance" | "price-asc" | "price-desc" | "rating" | "newest";
}

export function parseProductSearchParams(sp: Record<string, string | string[] | undefined>): ProductFilters {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const brandsParam = sp.brands;
  const idsParam = sp.ids;
  return {
    q: first(sp.q)?.trim() || undefined,
    category: first(sp.category) || undefined,
    brands: brandsParam ? (Array.isArray(brandsParam) ? brandsParam : brandsParam.split(",")).filter(Boolean) : undefined,
    ids: idsParam ? (Array.isArray(idsParam) ? idsParam : idsParam.split(",")).filter(Boolean) : undefined,
    inStockOnly: first(sp.inStock) === "1",
    minPrice: first(sp.minPrice) ? Number(first(sp.minPrice)) : undefined,
    maxPrice: first(sp.maxPrice) ? Number(first(sp.maxPrice)) : undefined,
    sort: (first(sp.sort) as ProductFilters["sort"]) || "relevance",
  };
}

export function getFilteredProducts(filters: ProductFilters): ProductDetail[] {
  let list = products.slice();

  if (filters.ids?.length) {
    const set = new Set(filters.ids);
    list = list.filter((p) => set.has(p.id));
  }
  if (filters.category) list = list.filter((p) => p.category.slug === filters.category);
  if (filters.brands?.length) {
    const set = new Set(filters.brands);
    list = list.filter((p) => set.has(p.brand.slug));
  }
  if (filters.inStockOnly) list = list.filter((p) => p.availability === "IN_STOCK" || p.availability === "LIMITED_STOCK");
  if (filters.minPrice !== undefined) list = list.filter((p) => p.priceINR >= filters.minPrice!);
  if (filters.maxPrice !== undefined) list = list.filter((p) => p.priceINR <= filters.maxPrice!);

  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.mpn?.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case "price-asc":
      list.sort((a, b) => a.priceINR - b.priceINR);
      break;
    case "price-desc":
      list.sort((a, b) => b.priceINR - a.priceINR);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      list.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      break;
    default:
      list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  return list;
}

/** "Cross-reference" suggestions: related items sharing category/brand with the search results, excluding exact matches. */
export function getCrossReferenceSuggestions(filters: ProductFilters, excludeIds: string[], take = 8): ProductDetail[] {
  if (!filters.q) return [];
  const excluded = new Set(excludeIds);
  const firstWord = filters.q.split(" ")[0]?.toLowerCase() ?? "";

  return products
    .filter((p) => !excluded.has(p.id) && ((filters.category && p.category.slug === filters.category) || p.name.toLowerCase().includes(firstWord)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, take);
}

export function getFilterOptions() {
  return { categories, brands };
}

export function getReviewsForProduct(productId: string): SeededReview[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getQuestionsForProduct(productId: string): SeededQuestion[] {
  return questions.filter((q) => q.productId === productId);
}
