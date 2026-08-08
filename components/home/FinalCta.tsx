import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
      <div className="relative overflow-hidden rounded-3xl gradient-brand p-10 text-center text-white shadow-2xl">
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 animate-blob" />
        <div className="pointer-events-none absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-white/10 animate-blob-delay" />
        <Mail className="mx-auto h-8 w-8" />
        <h2 className="mt-3 font-heading text-2xl font-extrabold md:text-3xl">Ready to Build Something Great?</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/85">
          Create a free account to save your cart, track quotes, and start earning loyalty points from your first order.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-primary shadow-lg transition hover:scale-105"
        >
          Create Free Account <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
