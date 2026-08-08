import { prisma } from "@/lib/prisma";
import { serializeProducts } from "@/lib/serialize";
import type { Prisma } from "@/lib/generated/prisma/client";

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

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (filters.ids?.length) where.id = { in: filters.ids };
  if (filters.category) where.category = { slug: filters.category };
  if (filters.brands?.length) where.brand = { slug: { in: filters.brands } };
  if (filters.inStockOnly) where.availability = { in: ["IN_STOCK", "LIMITED_STOCK"] };
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.priceINR = {};
    if (filters.minPrice !== undefined) where.priceINR.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.priceINR.lte = filters.maxPrice;
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { sku: { contains: filters.q, mode: "insensitive" } },
      { mpn: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { brand: { name: { contains: filters.q, mode: "insensitive" } } },
      { category: { name: { contains: filters.q, mode: "insensitive" } } },
    ];
  }

  return where;
}

function buildOrderBy(sort: ProductFilters["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { priceINR: "asc" };
    case "price-desc":
      return { priceINR: "desc" };
    case "rating":
      return { rating: "desc" };
    case "newest":
      return { createdAt: "desc" };
    default:
      return { isFeatured: "desc" };
  }
}

export async function getFilteredProducts(filters: ProductFilters) {
  const where = buildWhere(filters);
  const products = await prisma.product.findMany({
    where,
    include: { brand: true, category: true },
    orderBy: buildOrderBy(filters.sort),
  });
  return serializeProducts(products);
}

/** "Cross-reference" suggestions: related items sharing category/brand with the search results, excluding exact matches. */
export async function getCrossReferenceSuggestions(filters: ProductFilters, excludeIds: string[], take = 8) {
  if (!filters.q) return [];

  const candidates = await prisma.product.findMany({
    where: {
      id: { notIn: excludeIds },
      OR: [
        filters.category ? { category: { slug: filters.category } } : undefined,
        { name: { contains: filters.q.split(" ")[0], mode: "insensitive" } },
      ].filter(Boolean) as Prisma.ProductWhereInput[],
    },
    include: { brand: true, category: true },
    orderBy: { rating: "desc" },
    take,
  });

  return serializeProducts(candidates);
}

export async function getFilterOptions() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { categories, brands };
}
