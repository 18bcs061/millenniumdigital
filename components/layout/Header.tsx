"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  LogOut,
  ClipboardList,
  FileText,
  Wrench,
  Package,
  Code2,
} from "lucide-react";
import { useUiStore } from "@/lib/stores/ui-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { TierBadge } from "@/components/TierBadge";
import { CurrencySelect } from "@/components/CurrencySelect";

type CategoryLite = { name: string; slug: string };

const NAV_LINKS = [
  { label: "Order Details", href: "/orders", icon: Package },
  { label: "RFQ/BOM", href: "/rfq", icon: FileText },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "Millennium API", href: "/tools/api", icon: Code2 },
];

export function Header({ categories }: { categories: CategoryLite[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { openCartDrawer, mobileMenuOpen, setMobileMenuOpen } = useUiStore();
  const cartCount = useCartStore((s) => s.count());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [productsOpen, setProductsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) setProductsOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(search.trim() ? `/products?q=${encodeURIComponent(search.trim())}` : "/products");
  }

  return (
    <header className="sticky top-0 z-30">
      {/* Utility bar */}
      <div className="hidden bg-brand-navy text-slate-300 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <p className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
            Free delivery on prepaid orders above ₹2,000 · Bulk RFQ pricing available
          </p>
          <div className="flex items-center gap-4">
            <Link href="/tools/api" className="hover:text-white">Mellennium APIs</Link>
            <Link href="/rfq/lists" className="hover:text-white">Track Quote</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="glass border-b border-slate-200/70">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-brand shadow-lg"
            >
              <span className="font-heading text-lg font-black text-white">M</span>
            </motion.div>
            <div className="leading-tight">
              <p className="font-heading text-lg font-extrabold text-slate-900">MillenniumDigital</p>
              <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-brand-primary sm:block">Electronics Marketplace</p>
            </div>
          </Link>

          <form onSubmit={submitSearch} className="mx-2 hidden flex-1 items-center md:flex">
            <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition focus-within:border-brand-primary focus-within:shadow-md">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search parts, MPNs, sensors, boards..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <CurrencySelect className="hidden sm:block" />

            <Link href="/wishlist" className="relative rounded-full p-2 hover:bg-slate-100">
              <Heart className="h-5 w-5 text-slate-700" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button onClick={openCartDrawer} className="relative rounded-full p-2 hover:bg-slate-100">
              <ShoppingCart className="h-5 w-5 text-slate-700" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            <div ref={accountRef} className="relative">
              <button
                onClick={() => setAccountOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm hover:border-brand-primary"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                  <User className="h-4 w-4" />
                </span>
                {session?.user ? (
                  <TierBadge loyaltyPoints={session.user.loyaltyPoints} compact />
                ) : (
                  <span className="hidden text-sm font-semibold text-slate-700 sm:inline">Sign In</span>
                )}
              </button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
                  >
                    {session?.user ? (
                      <div className="space-y-3">
                        <p className="px-1 text-sm text-slate-500">
                          Signed in as <span className="font-semibold text-slate-800">{session.user.name}</span>
                        </p>
                        <TierBadge loyaltyPoints={session.user.loyaltyPoints} />
                        <Link href="/account" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-primary/5">
                          My Account
                        </Link>
                        <Link href="/orders" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-primary/5">
                          Orders
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 p-1">
                        <p className="text-sm text-slate-500">Sign in to unlock loyalty points, saved carts, and quote tracking.</p>
                        <Link href="/login" className="block rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary py-2 text-center text-sm font-bold text-white shadow-md">
                          Sign In
                        </Link>
                        <Link href="/register" className="block rounded-full border border-slate-200 py-2 text-center text-sm font-bold text-slate-700 hover:border-brand-primary">
                          Create Account
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="hidden border-b border-slate-200 bg-white/95 backdrop-blur lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-6">
          <Link href="/" className="rounded-lg px-4 py-3 text-sm font-bold text-slate-700 hover:text-brand-primary">
            Home
          </Link>

          <div ref={productsRef} className="relative">
            <button
              onClick={() => setProductsOpen((o) => !o)}
              className="flex items-center gap-1 rounded-lg px-4 py-3 text-sm font-bold text-slate-700 hover:text-brand-primary"
            >
              <LayoutGrid className="h-4 w-4" /> Products <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-0 z-30 mt-1 w-[560px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
                >
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Shop by Category</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/products"
                      onClick={() => setProductsOpen(false)}
                      className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-3 text-sm font-bold text-white shadow-md"
                    >
                      All Products →
                    </Link>
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/products?category=${c.slug}`}
                        onClick={() => setProductsOpen(false)}
                        className="rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/brands" className="rounded-lg px-4 py-3 text-sm font-bold text-slate-700 hover:text-brand-primary">
            Brands
          </Link>

          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-1.5 rounded-lg px-4 py-3 text-sm font-bold text-slate-700 hover:text-brand-primary">
              <link.icon className="h-4 w-4" /> {link.label}
            </Link>
          ))}

          <Link
            href="/rfq"
            className="ml-auto my-2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-accent to-amber-400 px-4 py-1.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
          >
            <ClipboardList className="h-4 w-4" /> Bulk RFQ / BOM
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-200 bg-white lg:hidden"
          >
            <form onSubmit={submitSearch} className="p-4">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search parts, MPNs..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </form>
            <div className="flex flex-col gap-1 px-4 pb-4">
              {[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Brands", href: "/brands" }, ...NAV_LINKS].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-brand-primary/5"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
