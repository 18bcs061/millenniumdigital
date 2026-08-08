import { CartView } from "@/components/cart/CartView";

export const metadata = { title: "Your Cart — MillenniumDigital" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <h1 className="mb-1 font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">Your Cart</h1>
      <p className="mb-6 text-sm text-slate-500">Review your items before checkout or requesting a formal quote.</p>
      <CartView variant="page" />
    </div>
  );
}
