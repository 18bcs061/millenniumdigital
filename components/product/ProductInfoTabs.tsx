"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, MessageCircleQuestion, ShieldCheck, Star, PackageCheck } from "lucide-react";
import { RatingStars } from "@/components/RatingStars";
import { useCommunityStore } from "@/lib/stores/community-store";
import { cn } from "@/lib/cn";

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
}

export interface QuestionItem {
  id: string;
  authorName: string;
  question: string;
  answer: string | null;
  createdAt: string;
}

const TABS = ["Description", "Specification", "Warranty", "Reviews", "Q&A", "Country of Origin"] as const;
type Tab = (typeof TABS)[number];

export function ProductInfoTabs({
  productId,
  description,
  features,
  packageIncludes,
  specifications,
  warranty,
  countryOfOrigin,
  initialReviews,
  initialQuestions,
}: {
  productId: string;
  description: string;
  features: string[];
  packageIncludes: string[];
  specifications: Record<string, string>;
  warranty: string;
  countryOfOrigin: string;
  initialReviews: ReviewItem[];
  initialQuestions: QuestionItem[];
}) {
  const [tab, setTab] = useState<Tab>("Description");
  const { status, data: session } = useSession();
  const router = useRouter();
  const { reviews: localReviews, questions: localQuestions, addReview, addQuestion } = useCommunityStore();

  const reviews = useMemo(
    () =>
      [...localReviews.filter((r) => r.productId === productId), ...initialReviews].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      ),
    [localReviews, initialReviews, productId]
  );
  const questions = useMemo(
    () =>
      [...localQuestions.filter((q) => q.productId === productId), ...initialQuestions].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      ),
    [localQuestions, initialQuestions, productId]
  );

  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [questionForm, setQuestionForm] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "authenticated") return router.push("/login");
    addReview({ productId, authorName: session.user.name ?? "Anonymous", ...reviewForm, title: reviewForm.title || null });
    setMessage("Thanks! Your review has been posted.");
    setReviewForm({ rating: 5, title: "", comment: "" });
  }

  function submitQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "authenticated") return router.push("/login");
    addQuestion({ productId, authorName: session.user.name ?? "Anonymous", question: questionForm, answer: null });
    setMessage("Your question has been submitted. Our team will answer shortly.");
    setQuestionForm("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="no-scrollbar flex overflow-x-auto border-b border-slate-200 px-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative shrink-0 px-4 py-3.5 text-sm font-bold transition",
              tab === t ? "text-brand-primary" : "text-slate-500 hover:text-slate-800"
            )}
          >
            {t}
            {tab === t && <motion.div layoutId="info-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-primary" />}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tab === "Description" && (
              <div className="space-y-4">
                <p className="leading-relaxed text-slate-600">{description}</p>
                {features.length > 0 && (
                  <div>
                    <p className="mb-2 font-heading text-sm font-bold text-slate-900">Key Features</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {packageIncludes.length > 0 && (
                  <div>
                    <p className="mb-2 font-heading text-sm font-bold text-slate-900">Package Includes</p>
                    <ul className="space-y-1.5">
                      {packageIncludes.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-sm text-slate-600">
                          <PackageCheck className="h-4 w-4 text-brand-primary" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {tab === "Specification" && (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(specifications).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="w-1/2 border-r border-slate-200 px-4 py-2.5 font-semibold text-slate-700">{key}</td>
                        <td className="px-4 py-2.5 text-slate-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "Warranty" && (
              <div className="flex items-start gap-3 rounded-xl bg-brand-primary/5 p-4">
                <ShieldCheck className="h-6 w-6 shrink-0 text-brand-primary" />
                <div>
                  <p className="font-heading font-bold text-slate-900">{warranty}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Covers manufacturing defects under normal use. Contact support with your order number for warranty claims.
                  </p>
                </div>
              </div>
            )}

            {tab === "Reviews" && (
              <div className="space-y-5">
                {reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet — be the first to share your experience.</p>}
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-slate-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <p className="font-heading text-sm font-bold text-slate-800">{r.authorName}</p>
                      <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <RatingStars rating={r.rating} />
                    {r.title && <p className="mt-1 text-sm font-semibold text-slate-700">{r.title}</p>}
                    <p className="mt-1 text-sm text-slate-600">{r.comment}</p>
                  </div>
                ))}

                <form onSubmit={submitReview} className="space-y-3 rounded-xl border border-dashed border-slate-300 p-4">
                  <p className="flex items-center gap-1.5 font-heading text-sm font-bold text-slate-800">
                    <Star className="h-4 w-4 text-brand-accent" /> Write a Review
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button type="button" key={n} onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}>
                        <Star className={cn("h-5 w-5", n <= reviewForm.rating ? "fill-brand-accent text-brand-accent" : "text-slate-300")} />
                      </button>
                    ))}
                  </div>
                  <input
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Review title (optional)"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                  <textarea
                    required
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                  <button className="rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-sm font-bold text-white shadow-md disabled:opacity-50">
                    {status === "authenticated" ? "Submit Review" : "Sign In to Review"}
                  </button>
                </form>
              </div>
            )}

            {tab === "Q&A" && (
              <div className="space-y-5">
                {questions.length === 0 && <p className="text-sm text-slate-500">No questions yet — ask us anything about this product.</p>}
                {questions.map((q) => (
                  <div key={q.id} className="border-b border-slate-100 pb-4 last:border-0">
                    <p className="flex items-center gap-1.5 font-heading text-sm font-bold text-slate-800">
                      <MessageCircleQuestion className="h-4 w-4 text-brand-secondary" /> {q.question}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Asked by {q.authorName}</p>
                    {q.answer ? (
                      <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{q.answer}</p>
                    ) : (
                      <p className="mt-2 text-xs italic text-slate-400">Awaiting an answer from our team.</p>
                    )}
                  </div>
                ))}

                <form onSubmit={submitQuestion} className="space-y-3 rounded-xl border border-dashed border-slate-300 p-4">
                  <p className="font-heading text-sm font-bold text-slate-800">Ask a Question</p>
                  <textarea
                    required
                    value={questionForm}
                    onChange={(e) => setQuestionForm(e.target.value)}
                    placeholder="What would you like to know about this product?"
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                  <button className="rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-sm font-bold text-white shadow-md disabled:opacity-50">
                    {status === "authenticated" ? "Submit Question" : "Sign In to Ask"}
                  </button>
                </form>
              </div>
            )}

            {tab === "Country of Origin" && (
              <div className="flex items-center gap-3 rounded-xl bg-brand-secondary/5 p-4">
                <Globe2 className="h-6 w-6 text-brand-secondary" />
                <div>
                  <p className="font-heading font-bold text-slate-900">Made in {countryOfOrigin}</p>
                  <p className="text-sm text-slate-600">Sourced and quality-checked in accordance with international manufacturing standards.</p>
                </div>
              </div>
            )}

            {message && <p className="mt-3 text-sm font-semibold text-brand-primary">{message}</p>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
