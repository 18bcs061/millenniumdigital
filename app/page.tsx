import { getCategories, getBrands, getAllProducts, getProductCountByCategory } from "@/lib/catalog";
import { HeroSection } from "@/components/home/HeroSection";
import { BuildPicker } from "@/components/home/BuildPicker";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { SiliconJourney } from "@/components/home/SiliconJourney";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanners } from "@/components/home/PromoBanners";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Testimonials } from "@/components/home/Testimonials";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  const categories = getCategories();
  const brands = getBrands();
  const officialBrands = brands.filter((b) => b.isOfficial);
  const products = getAllProducts();
  const productCounts = getProductCountByCategory();

  const categoriesWithCounts = categories.map((c) => ({ ...c, _count: { products: productCounts[c.slug] ?? 0 } }));
  const featured = products
    .filter((p) => p.isFeatured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  return (
    <div>
      <HeroSection stats={{ products: products.length, brands: brands.length, categories: categories.length }} />
      <BuildPicker categories={categoriesWithCounts} />
      <CategoryShowcase categories={categoriesWithCounts} />
      <BrandMarquee brands={officialBrands} />
      <SiliconJourney />
      <VideoShowcase />
      <FeaturedProducts products={featured} />
      <PromoBanners />
      <TrustStrip />
      <Testimonials />
      <GoogleReviews />
      <FinalCta />
    </div>
  );
}
