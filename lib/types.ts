export interface BrandLite {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isOfficial: boolean;
  countryOfOrigin: string;
  establishmentYear: number;
  description: string;
  whyChoose: string;
}

export interface CategoryLite {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  mpn: string | null;
  priceINR: number;
  description: string;
  countryOfOrigin: string;
  availability: "IN_STOCK" | "LIMITED_STOCK" | "OUT_OF_STOCK" | "BACKORDER";
  stockQty: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isFeatured: boolean;
  warranty: string;
  createdAt: string;
  brand: BrandLite;
  category: CategoryLite;
}

export interface ProductDetail extends ProductListItem {
  features: string[];
  packageIncludes: string[];
  specifications: Record<string, string>;
}
