import type { Product, Brand, Category } from "@/lib/generated/prisma/client";
import type { ProductListItem } from "@/lib/types";

type ProductWithRelations = Product & { brand: Brand; category: Category };

/** Converts Prisma Decimal fields to plain numbers so route handlers can safely NextResponse.json() them. */
export function serializeProduct(p: ProductWithRelations): ProductListItem {
  return {
    ...p,
    priceINR: Number(p.priceINR),
    createdAt: p.createdAt.toISOString(),
    brand: { ...p.brand },
    category: { ...p.category },
  };
}

export function serializeProducts(list: ProductWithRelations[]): ProductListItem[] {
  return list.map(serializeProduct);
}
