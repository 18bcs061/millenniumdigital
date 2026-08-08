/**
 * One-time export: reads the current Postgres database (populated by prisma/seed.ts)
 * and dumps everything the app needs into static JSON files under /data, so the app
 * can run entirely off bundled JSON with no database (deployable to Vercel as-is).
 *
 * Run with: npm run export:json
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";

const OUT_DIR = path.join(process.cwd(), "data");

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const [categories, brands, products, reviews, questions, users, orders, rfqQuotes, bomLists] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.question.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany(),
    prisma.order.findMany({ include: { items: true } }),
    prisma.rfqQuote.findMany({ include: { lineItems: true } }),
    prisma.bomList.findMany({ include: { lineItems: true } }),
  ]);

  const write = (name: string, data: unknown) => {
    fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(data, null, 2));
    console.log(`Wrote data/${name}.json (${Array.isArray(data) ? data.length : 1} records)`);
  };

  write("categories", categories);
  write("brands", brands);
  write(
    "products",
    products.map((p) => ({ ...p, priceINR: Number(p.priceINR) }))
  );
  write("reviews", reviews);
  write("questions", questions);
  write(
    "users",
    users.map((u) => ({ id: u.id, name: u.name, email: u.email, passwordHash: u.passwordHash, loyaltyPoints: u.loyaltyPoints }))
  );
  write(
    "orders",
    orders.map((o) => ({
      ...o,
      total: Number(o.total),
      items: o.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
    }))
  );
  write(
    "rfq-quotes",
    rfqQuotes.map((q) => ({
      ...q,
      lineItems: q.lineItems.map((li) => ({ ...li, targetUnitPrice: li.targetUnitPrice ? Number(li.targetUnitPrice) : null })),
    }))
  );
  write(
    "bom-lists",
    bomLists.map((b) => ({
      ...b,
      lineItems: b.lineItems.map((li) => ({ ...li, targetUnitPrice: li.targetUnitPrice ? Number(li.targetUnitPrice) : null })),
    }))
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
