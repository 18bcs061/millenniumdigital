import { create } from "zustand";
import { persist } from "zustand/middleware";
import seededQuotes from "@/data/rfq-quotes.json";
import seededBomLists from "@/data/bom-lists.json";

export interface RfqLineItem {
  id: string;
  partNumber: string;
  productInfo: string | null;
  customerNumber: string | null;
  quantity: number;
  targetUnitPrice: number | null;
  targetLeadTime: string | null;
  packaging: string | null;
}

export type RfqStatus = "SUBMITTED" | "PROCESSING" | "QUOTED" | "ORDERED";

export interface RfqQuoteRecord {
  id: string;
  quoteNumber: string;
  status: RfqStatus;
  contactName: string;
  email: string;
  country: string;
  poNumber: string | null;
  comment: string | null;
  createdAt: string;
  lineItems: RfqLineItem[];
}

export interface BomListRecord {
  id: string;
  name: string;
  createdAt: string;
  lineItems: RfqLineItem[];
}

interface RfqState {
  quotes: RfqQuoteRecord[];
  bomLists: BomListRecord[];
  submitQuote: (input: {
    contactName: string;
    email: string;
    country: string;
    poNumber?: string;
    comment?: string;
    lineItems: RfqLineItem[];
  }) => RfqQuoteRecord;
  saveBomList: (name: string, lineItems: RfqLineItem[]) => BomListRecord;
}

function generateQuoteNumber() {
  const year = new Date().getFullYear();
  return `RFQ-${year}-${Math.floor(10000 + Math.random() * 89999)}`;
}

/** RFQ quotes & BOM lists live in the browser (localStorage) — no backend yet. */
export const useRfqStore = create<RfqState>()(
  persist(
    (set, get) => ({
      quotes: seededQuotes as RfqQuoteRecord[],
      bomLists: seededBomLists as BomListRecord[],
      submitQuote: (input) => {
        const quote: RfqQuoteRecord = {
          id: crypto.randomUUID(),
          quoteNumber: generateQuoteNumber(),
          status: "SUBMITTED",
          contactName: input.contactName,
          email: input.email,
          country: input.country,
          poNumber: input.poNumber ?? null,
          comment: input.comment ?? null,
          createdAt: new Date().toISOString(),
          lineItems: input.lineItems,
        };
        set({ quotes: [quote, ...get().quotes] });
        return quote;
      },
      saveBomList: (name, lineItems) => {
        const list: BomListRecord = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString(), lineItems };
        set({ bomLists: [list, ...get().bomLists] });
        return list;
      },
    }),
    { name: "md-rfq", skipHydration: true }
  )
);
