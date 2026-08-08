"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { User, LogOut, Package, FileText, Heart, ShoppingCart, Mail } from "lucide-react";
import { TierBadge } from "@/components/TierBadge";

const QUICK_LINKS = [
  { icon: ShoppingCart, label: "My Cart", href: "/cart" },
  { icon: Heart, label: "My Wishlist", href: "/wishlist" },
  { icon: Package, label: "My Orders", href: "/orders" },
  { icon: FileText, label: "My RFQs & Quotes", href: "/rfq/lists" },
];

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-400">Loading account...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
        <User className="h-10 w-10 text-brand-primary" />
        <p className="font-heading text-xl font-extrabold text-slate-900">Sign in to view your account</p>
        <Link href="/login" className="mt-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2 text-sm font-bold text-white shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl gradient-brand p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 animate-blob" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-black">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="font-heading text-2xl font-extrabold">{user.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-white/80">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="ml-auto flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="mb-3 font-heading text-lg font-extrabold text-slate-900">Loyalty & Engagement</h2>
          <TierBadge loyaltyPoints={user.loyaltyPoints} />
          <p className="mt-3 text-xs text-slate-400">
            Tiers: <span className="font-semibold text-slate-600">Member</span> (0+) →{" "}
            <span className="font-semibold text-slate-600">Preferred</span> (1,000+) →{" "}
            <span className="font-semibold text-slate-600">Premier</span> (5,000+). Earn 1 point per ₹100 spent.
          </p>
        </div>

        <div>
          <h2 className="mb-3 font-heading text-lg font-extrabold text-slate-900">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-md">
                <l.icon className="h-5 w-5 text-brand-primary" />
                <span className="text-xs font-bold text-slate-700">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
