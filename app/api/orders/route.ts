import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProductById } from "@/lib/catalog";
import ordersData from "@/data/orders.json";

interface OrderItemRecord {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}
interface OrderRecord {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  poNumber: string | null;
  currency: string;
  total: number;
  createdAt: string;
  items: OrderItemRecord[];
}

const orders = ordersData as OrderRecord[];

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ orders: [] }, { status: 401 });

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim().toLowerCase();
  const status = url.searchParams.get("status");

  const filtered = orders
    .filter((o) => o.userId === session.user.id)
    .filter((o) => !status || o.status === status)
    .filter((o) => {
      if (!q) return true;
      if (o.orderNumber.toLowerCase().includes(q)) return true;
      if (o.poNumber?.toLowerCase().includes(q)) return true;
      return o.items.some((item) => {
        const product = getProductById(item.productId);
        return product?.sku.toLowerCase().includes(q) || product?.name.toLowerCase().includes(q);
      });
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const serialized = filtered.map((o) => ({
    ...o,
    items: o.items.map((i) => ({ ...i, product: getProductById(i.productId) })),
  }));

  return NextResponse.json({ orders: serialized });
}
