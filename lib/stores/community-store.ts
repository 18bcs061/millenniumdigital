import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocalReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
}

export interface LocalQuestion {
  id: string;
  productId: string;
  authorName: string;
  question: string;
  answer: string | null;
  createdAt: string;
}

interface CommunityState {
  reviews: LocalReview[];
  questions: LocalQuestion[];
  addReview: (input: Omit<LocalReview, "id" | "createdAt">) => void;
  addQuestion: (input: Omit<LocalQuestion, "id" | "createdAt">) => void;
}

/** Reviews and Q&A submitted in this browser — no backend yet, so these live in localStorage only. */
export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      reviews: [],
      questions: [],
      addReview: (input) =>
        set({ reviews: [{ ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...get().reviews] }),
      addQuestion: (input) =>
        set({ questions: [{ ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...get().questions] }),
    }),
    { name: "md-community", skipHydration: true }
  )
);
