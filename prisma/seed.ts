import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Availability } from "../lib/generated/prisma/client";
import { slugify } from "../lib/slug";

import rawCategories from "./seed-data/categories.json";
import rawBrands from "./seed-data/brands.json";
import rawProducts from "./seed-data/products.json";
import featuredBrands from "./seed-data/featured-brands.json";
import featuredProducts from "./seed-data/featured-products.json";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Maps the generic catalog's free-text "Category" values onto the 6 curated Category records. */
const GENERIC_CATEGORY_MAP: Record<string, string> = {
  "Development Boards": "embedded-solutions",
  "Sensors": "sensors",
  "IoT & Wireless": "semiconductors",
  "Motors & Drivers": "power",
  "Electronic Components": "semiconductors",
  "DIY & Maker Kits": "embedded-solutions",
};

/** Extra brands referenced by the generic 54-item catalog but absent from the official Brands sheet. */
const EXTRA_GENERIC_BRANDS: Record<string, { description: string; whyChoose: string; countryOfOrigin: string; establishmentYear: number }> = {
  SmartElex: {
    description: "SmartElex is an India-based supplier of sensors, motor drivers, and robotics components popular among Indian makers and engineering students.",
    whyChoose: "Popular Indian robotics component source.",
    countryOfOrigin: "India",
    establishmentYear: 2016,
  },
  EasyMech: {
    description: "EasyMech designs mechanical and electronic building blocks — motors, drivers, and sensors — tailored for robotics education and DIY projects in India.",
    whyChoose: "Robotics-ready mechanical + electronic kits.",
    countryOfOrigin: "India",
    establishmentYear: 2018,
  },
  Cytron: {
    description: "Cytron Technologies is a Malaysia-based robotics and electronics company known for motor drivers, controllers, and maker-friendly boards across Southeast Asia.",
    whyChoose: "Trusted Southeast-Asian robotics brand.",
    countryOfOrigin: "Malaysia",
    establishmentYear: 2003,
  },
};

const OFFICIAL_BRAND_LOGOS: Record<string, string> = {
  Arduino: "/brands/arduino.jpeg",
  "Raspberry Pi": "/brands/raspberry-pi.png",
  Espressif: "/brands/espressif.png",
  DFRobot: "/brands/dfrobot.jpeg",
  "Seeed Studio": "/brands/seeed-studio.jpeg",
  Waveshare: "/brands/waveshare.png",
  SparkFun: "/brands/sparkfun.png",
  Adafruit: "/brands/adafruit.png",
  Panasonic: "/brands/panasonic.png",
};

function parseSpecString(spec: string): Record<string, string> {
  const out: Record<string, string> = {};
  spec.split(";").forEach((part) => {
    const [key, ...rest] = part.split(":");
    if (key && rest.length) out[key.trim()] = rest.join(":").trim();
  });
  return out;
}

function parseAvailability(text: string): Availability {
  const t = text.toLowerCase();
  if (t.includes("out of stock")) return Availability.OUT_OF_STOCK;
  if (t.includes("limited")) return Availability.LIMITED_STOCK;
  if (t.includes("backorder")) return Availability.BACKORDER;
  return Availability.IN_STOCK;
}

function stockQtyForAvailability(a: Availability, seedNum: number): number {
  switch (a) {
    case Availability.OUT_OF_STOCK:
      return 0;
    case Availability.LIMITED_STOCK:
      return 1 + (seedNum % 15);
    case Availability.BACKORDER:
      return 0;
    default:
      return 40 + (seedNum % 260);
  }
}

function parseRating(text: string): number {
  const match = text.match(/([\d.]+)\s*\/\s*5/);
  return match ? parseFloat(match[1]) : 4.0;
}

/** Deterministic pseudo-random review count so re-running the seed is stable. */
function reviewCountFromSku(sku: string): number {
  let hash = 0;
  for (let i = 0; i < sku.length; i++) hash = (hash * 31 + sku.charCodeAt(i)) >>> 0;
  return 5 + (hash % 180);
}

async function main() {
  console.log("Seeding categories...");
  const categoryBySlug = new Map<string, { id: string }>();
  for (const c of rawCategories as { "Category Name": string; "Category Description": string }[]) {
    const slug = slugify(c["Category Name"]);
    const category = await prisma.category.upsert({
      where: { slug },
      update: { description: c["Category Description"] },
      create: { name: c["Category Name"], slug, description: c["Category Description"] },
    });
    categoryBySlug.set(slug, category);
  }

  console.log("Seeding official brands...");
  const brandByName = new Map<string, { id: string }>();
  for (const b of rawBrands as {
    "Brand Name": string;
    "Brand Description": string;
    "Why Choose": string;
    "Country of Origin": string;
    "Establishment Year": number;
  }[]) {
    const name = b["Brand Name"];
    const slug = slugify(name);
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        description: b["Brand Description"],
        whyChoose: b["Why Choose"],
        countryOfOrigin: b["Country of Origin"],
        establishmentYear: b["Establishment Year"],
        logoUrl: OFFICIAL_BRAND_LOGOS[name] ?? null,
        isOfficial: true,
      },
    });
    brandByName.set(name, brand);
  }

  console.log("Seeding extra generic-catalog brands...");
  for (const [name, info] of Object.entries(EXTRA_GENERIC_BRANDS)) {
    const slug = slugify(name);
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: { name, slug, isOfficial: false, ...info },
    });
    brandByName.set(name, brand);
  }

  console.log("Seeding featured-product brands...");
  for (const b of featuredBrands as {
    name: string;
    description: string;
    whyChoose: string;
    countryOfOrigin: string;
    establishmentYear: number;
  }[]) {
    const slug = slugify(b.name);
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: { ...b, slug, isOfficial: false },
    });
    brandByName.set(b.name, brand);
  }

  console.log("Seeding generic catalog products...");
  let created = 0;
  for (const p of rawProducts as {
    "Product Name": string;
    "Part Number / SKU": string;
    "Manufacturer / Brand": string;
    Category: string;
    "Price (INR)": number;
    Description: string;
    Availability: string;
    Specifications: string;
    "Country of Origin": string;
    "Customer Review": string;
  }[]) {
    const sku = p["Part Number / SKU"];
    const categorySlug = GENERIC_CATEGORY_MAP[p.Category] ?? "semiconductors";
    const category = categoryBySlug.get(categorySlug);
    const brand = brandByName.get(p["Manufacturer / Brand"]);
    if (!category || !brand) {
      console.warn(`Skipping ${sku}: missing category/brand mapping`);
      continue;
    }
    const availability = parseAvailability(p.Availability);
    const slug = `${slugify(p["Product Name"])}-${sku.toLowerCase()}`;

    await prisma.product.upsert({
      where: { sku },
      update: {},
      create: {
        name: p["Product Name"],
        slug,
        sku,
        brandId: brand.id,
        categoryId: category.id,
        priceINR: p["Price (INR)"],
        description: p.Description,
        features: [
          "Reliable prototyping-grade component",
          "Widely compatible with common dev boards",
          "Backed by manufacturer datasheet specifications",
        ],
        packageIncludes: [`1 x ${p["Product Name"]}`],
        specifications: parseSpecString(p.Specifications),
        countryOfOrigin: p["Country of Origin"],
        availability,
        stockQty: stockQtyForAvailability(availability, sku.length + created),
        rating: parseRating(p["Customer Review"]),
        reviewCount: reviewCountFromSku(sku),
        images: [],
        isFeatured: false,
      },
    });
    created++;
  }
  console.log(`Upserted ${created} generic products.`);

  console.log("Seeding featured (real-photo) products...");
  let featuredCreated = 0;
  for (const p of featuredProducts as unknown as {
    name: string;
    sku: string;
    mpn: string;
    brand: string;
    category: string;
    priceINR: number;
    description: string;
    features: string[];
    packageIncludes: string[];
    specifications: Record<string, string>;
    countryOfOrigin: string;
    availability: string;
    stockQty: number;
    rating: number;
    reviewCount: number;
    images: string[];
    warranty: string;
  }[]) {
    const category = categoryBySlug.get(p.category);
    const brand = brandByName.get(p.brand);
    if (!category || !brand) {
      console.warn(`Skipping featured ${p.sku}: missing category/brand mapping`);
      continue;
    }
    const slug = `${slugify(p.name)}-${slugify(p.sku)}`;

    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        slug,
        sku: p.sku,
        mpn: p.mpn,
        brandId: brand.id,
        categoryId: category.id,
        priceINR: p.priceINR,
        description: p.description,
        features: p.features,
        packageIncludes: p.packageIncludes,
        specifications: p.specifications,
        countryOfOrigin: p.countryOfOrigin,
        availability: p.availability as Availability,
        stockQty: p.stockQty,
        rating: p.rating,
        reviewCount: p.reviewCount,
        images: p.images,
        isFeatured: true,
        warranty: p.warranty,
      },
    });
    featuredCreated++;
  }
  console.log(`Upserted ${featuredCreated} featured products.`);

  console.log("Seeding demo user...");
  const demoPasswordHash = await bcrypt.hash("Demo@1234", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@millenniumdigital.com" },
    update: {},
    create: {
      name: "Alex Morgan",
      email: "demo@millenniumdigital.com",
      passwordHash: demoPasswordHash,
      loyaltyPoints: 2450,
    },
  });

  console.log("Seeding sample reviews, Q&A, cart, wishlist, order, and RFQ for demo user...");
  const sampleProducts = await prisma.product.findMany({ take: 8, orderBy: { createdAt: "asc" } });
  if (sampleProducts.length >= 4) {
    await prisma.review.createMany({
      data: [
        {
          productId: sampleProducts[0].id,
          userId: demoUser.id,
          authorName: demoUser.name,
          rating: 5,
          title: "Exactly as described",
          comment: "Worked perfectly in my industrial monitoring rig. Fast shipping too.",
        },
        {
          productId: sampleProducts[1].id,
          authorName: "Priya N.",
          rating: 4,
          title: "Solid build quality",
          comment: "Good value for the price, would buy again for bulk projects.",
        },
      ],
      skipDuplicates: true,
    });

    await prisma.question.createMany({
      data: [
        {
          productId: sampleProducts[0].id,
          authorName: "Rahul S.",
          question: "Is this compatible with 3.3V logic boards?",
          answer: "Yes, it operates natively between 3.3V and 5V.",
        },
        {
          productId: sampleProducts[2].id,
          authorName: "Meera K.",
          question: "What's the typical lead time for bulk orders above 5000 units?",
          answer: null,
        },
      ],
      skipDuplicates: true,
    });

    await prisma.cartItem.upsert({
      where: { userId_productId: { userId: demoUser.id, productId: sampleProducts[0].id } },
      update: {},
      create: { userId: demoUser.id, productId: sampleProducts[0].id, quantity: 2 },
    });
    await prisma.cartItem.upsert({
      where: { userId_productId: { userId: demoUser.id, productId: sampleProducts[1].id } },
      update: {},
      create: { userId: demoUser.id, productId: sampleProducts[1].id, quantity: 1 },
    });

    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: demoUser.id, productId: sampleProducts[3].id } },
      update: {},
      create: { userId: demoUser.id, productId: sampleProducts[3].id },
    });

    const existingOrder = await prisma.order.findUnique({ where: { orderNumber: "ORD-2026-00042" } });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          userId: demoUser.id,
          orderNumber: "ORD-2026-00042",
          status: "SHIPPED",
          currency: "INR",
          total: Number(sampleProducts[0].priceINR) * 2 + Number(sampleProducts[1].priceINR),
          items: {
            create: [
              { productId: sampleProducts[0].id, quantity: 2, unitPrice: sampleProducts[0].priceINR },
              { productId: sampleProducts[1].id, quantity: 1, unitPrice: sampleProducts[1].priceINR },
            ],
          },
        },
      });
    }

    const existingRfq = await prisma.rfqQuote.findUnique({ where: { quoteNumber: "RFQ-2026-00017" } });
    if (!existingRfq) {
      await prisma.rfqQuote.create({
        data: {
          userId: demoUser.id,
          quoteNumber: "RFQ-2026-00017",
          status: "PROCESSING",
          contactName: demoUser.name,
          email: demoUser.email,
          country: "India",
          poNumber: "PO-88213",
          comment: "Need pricing for a production run, please quote for 10k units.",
          lineItems: {
            create: [
              { partNumber: sampleProducts[0].sku, productInfo: sampleProducts[0].name, quantity: 10000, targetLeadTime: "6 weeks", packaging: "Reel" },
              { partNumber: sampleProducts[2].sku, productInfo: sampleProducts[2].name, quantity: 5000, targetLeadTime: "4 weeks", packaging: "Tray" },
            ],
          },
        },
      });
    }

    await prisma.bomList.upsert({
      where: { id: "seed-bom-list-1" },
      update: {},
      create: {
        id: "seed-bom-list-1",
        userId: demoUser.id,
        name: "Q3 Production BOM",
        lineItems: {
          create: [
            { partNumber: sampleProducts[0].sku, productInfo: sampleProducts[0].name, quantity: 2500, packaging: "Reel" },
            { partNumber: sampleProducts[1].sku, productInfo: sampleProducts[1].name, quantity: 1200, packaging: "Tube" },
          ],
        },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
