"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserPen, ShoppingCart, Heart, Package, FileText, SearchCheck, Calculator, Headset } from "lucide-react";
import { useChatStore } from "@/lib/stores/chat-store";
import { TiltCard } from "@/components/motion/TiltCard";
import { staggerContainer, fadeUp } from "@/lib/motion";

export function QuickActionsGrid({ onEditProfile }: { onEditProfile: () => void }) {
  const openChat = useChatStore((s) => s.openChat);

  const actions = [
    { icon: UserPen, label: "Edit Profile", desc: "Update your details", onClick: onEditProfile },
    { icon: ShoppingCart, label: "My Cart", desc: "Review your items", href: "/cart" },
    { icon: Heart, label: "Wishlist", desc: "Saved for later", href: "/wishlist" },
    { icon: Package, label: "My Orders", desc: "Track shipments", href: "/orders" },
    { icon: FileText, label: "RFQs & Quotes", desc: "Bulk pricing requests", href: "/rfq/lists" },
    { icon: SearchCheck, label: "Track a Quote", desc: "Check quote status", href: "/tools/track-quote" },
    { icon: Calculator, label: "Price Assistance", desc: "Model volume pricing", href: "/tools/price-assistance" },
    { icon: Headset, label: "Need Help?", desc: "Chat with support", onClick: openChat },
  ];

  return (
    <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) =>
        action.href ? (
          <motion.div key={action.label} variants={fadeUp} className="h-full">
            <TiltCard intensity={10} className="h-full">
              <Link
                href={action.href}
                className="flex h-full flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:border-brand-primary/40 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-sm">
                  <action.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-800">{action.label}</p>
                <p className="text-[11px] text-slate-400">{action.desc}</p>
              </Link>
            </TiltCard>
          </motion.div>
        ) : (
          <motion.div key={action.label} variants={fadeUp} className="h-full">
            <TiltCard intensity={10} className="h-full">
              <button
                onClick={action.onClick}
                className="flex h-full w-full flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:border-brand-primary/40 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-sm">
                  <action.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-800">{action.label}</p>
                <p className="text-[11px] text-slate-400">{action.desc}</p>
              </button>
            </TiltCard>
          </motion.div>
        )
      )}
    </motion.div>
  );
}
