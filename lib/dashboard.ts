export interface DashboardOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface DashboardOrder {
  id: string;
  orderNumber: string;
  status: string;
  poNumber: string | null;
  currency: string;
  total: number;
  createdAt: string;
  items: DashboardOrderItem[];
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface MonthlyPoint {
  key: string;
  label: string;
  amount: number;
  orders: number;
}

/** Groups orders into calendar months, oldest first, so charts read left-to-right as a real timeline. */
export function computeMonthlySeries(orders: DashboardOrder[]): MonthlyPoint[] {
  const byMonth = new Map<string, MonthlyPoint>();

  for (const order of orders) {
    const d = new Date(order.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = MONTH_LABELS[d.getMonth()];
    const existing = byMonth.get(key);
    if (existing) {
      existing.amount += order.total;
      existing.orders += 1;
    } else {
      byMonth.set(key, { key, label, amount: order.total, orders: 1 });
    }
  }

  return Array.from(byMonth.values()).sort((a, b) => a.key.localeCompare(b.key));
}

export interface DashboardStats {
  totalSpent: number;
  totalOrders: number;
  avgOrderValue: number;
  deliveredCount: number;
  inTransitCount: number;
  spendDeltaPct: number | null;
}

export function computeStats(orders: DashboardOrder[]): DashboardStats {
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const inTransitCount = orders.filter((o) => o.status === "SHIPPED" || o.status === "PROCESSING" || o.status === "CONFIRMED").length;

  const series = computeMonthlySeries(orders);
  const last = series.at(-1);
  const prev = series.at(-2);
  const spendDeltaPct = last && prev && prev.amount > 0 ? ((last.amount - prev.amount) / prev.amount) * 100 : null;

  return {
    totalSpent,
    totalOrders,
    avgOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
    deliveredCount,
    inTransitCount,
    spendDeltaPct,
  };
}

export interface StatusSlice {
  status: string;
  label: string;
  count: number;
}

export function computeStatusBreakdown(orders: DashboardOrder[]): StatusSlice[] {
  const labels: Record<string, string> = {
    PROCESSING: "Processing",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  const counts = new Map<string, number>();
  for (const o of orders) counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
  return Array.from(counts.entries()).map(([status, count]) => ({ status, label: labels[status] ?? status, count }));
}
