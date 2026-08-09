"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, BadgeCheck, Star } from "lucide-react";
import { GoogleG } from "@/components/icons/GoogleG";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

const AVATAR_COLORS = ["from-brand-primary to-brand-accent", "from-fuchsia-600 to-rose-500", "from-slate-600 to-slate-400", "from-rose-600 to-pink-400", "from-brand-primary-dark to-fuchsia-500"];

const REVIEWS = [
  { name: "Rohan Mehta", date: "2026-06-14", rating: 5, text: "Fast, reliable delivery and 100% genuine parts. This is now my go-to for sensor modules." },
  { name: "Ayesha Khan", date: "2026-06-02", rating: 5, text: "Submitted an RFQ for a bulk order and had a quote back within a day. Very impressive turnaround." },
  { name: "Daniel Osei", date: "2026-05-28", rating: 4, text: "Great catalog variety and easy compare tool. Shipping could be a touch faster but overall solid." },
  { name: "Priya Nair", date: "2026-05-19", rating: 5, text: "The compare feature helped me pick the right motor driver in minutes. Saved me a lot of research time." },
  { name: "Lucas Fernandes", date: "2026-05-10", rating: 5, text: "Support team actually understood the technical specs I was asking about. Rare and appreciated." },
  { name: "Meera Iyer", date: "2026-04-30", rating: 5, text: "Loyalty points and the Preferred tier perks are a nice touch. Will keep ordering here for sure." },
];

export function GoogleReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const amount = (card?.offsetWidth ?? 300) + 16;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  useEffect(() => {
    const id = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else scrollByCard(1);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUp} className="mb-8 flex items-center gap-4">
          <GoogleG className="h-8 w-8 shrink-0" />
          <h2 className="whitespace-nowrap font-heading text-xl font-extrabold text-slate-900 md:text-2xl">
            Google Backed Trust in Every Order
          </h2>
          <div className="h-px flex-1 bg-slate-200" />
        </motion.div>

        <motion.div variants={fadeUp} className="relative">
          <div ref={scrollRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2">
            <div
              data-review-card
              className="relative flex w-64 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-white p-6 shadow-md ring-1 ring-slate-100"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 blur-2xl" />
              <GoogleG className="relative h-9 w-9" />
              <div className="relative mt-4">
                <p className="font-heading text-lg font-extrabold text-slate-900">Google</p>
                <p className="text-sm font-semibold text-slate-500">Customer Reviews</p>
                <div className="mt-2 flex text-brand-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-accent text-brand-accent" />
                  ))}
                </div>
              </div>
            </div>

            {REVIEWS.map((r, i) => (
              <div
                key={r.name}
                data-review-card
                className="w-72 shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white", AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{r.name}</p>
                      <p className="text-xs text-slate-400">{r.date}</p>
                    </div>
                  </div>
                  <GoogleG className="h-4 w-4 shrink-0" />
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={cn("h-3.5 w-3.5", s < r.rating ? "fill-brand-accent text-brand-accent" : "fill-slate-200 text-slate-200")} />
                  ))}
                  <BadgeCheck className="h-3.5 w-3.5 text-brand-secondary" />
                </div>
                <p className="mt-2 line-clamp-4 text-sm text-slate-600">{r.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Previous reviews"
            className="absolute -left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:text-brand-primary sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Next reviews"
            className="absolute -right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:text-brand-primary sm:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
