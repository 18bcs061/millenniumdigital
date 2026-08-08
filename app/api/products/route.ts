import { NextResponse } from "next/server";
import { parseProductSearchParams, getFilteredProducts } from "@/lib/catalog";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sp: Record<string, string> = {};
  url.searchParams.forEach((value, key) => (sp[key] = value));

  const filters = parseProductSearchParams(sp);
  const products = await getFilteredProducts(filters);
  const limit = sp.limit ? Number(sp.limit) : undefined;

  return NextResponse.json({ products: limit ? products.slice(0, limit) : products });
}
