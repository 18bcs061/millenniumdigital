"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { LogIn, Sparkles, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [email, setEmail] = useState("demo@millenniumdigital.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email or password.");
    else router.push(callbackUrl);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Demo@1234"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
        />
      </div>
      {error && <p className="text-sm font-semibold text-rose-500">{error}</p>}
      <button
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" /> {loading ? "Signing in..." : "Sign In"}
      </button>
      <p className="rounded-xl bg-brand-primary/5 p-3 text-center text-xs text-slate-500">
        Demo account: <span className="font-semibold">demo@millenniumdigital.com</span> / <span className="font-semibold">Demo@1234</span>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-3 font-heading text-2xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500">Sign in to access your cart, wishlist, and loyalty tier.</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <Link href="/register" className="font-bold text-brand-primary hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5" /> Your data is protected with encrypted sessions.
      </p>
    </div>
  );
}
