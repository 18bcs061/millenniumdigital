import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BomRow {
  id: string;
  partNumber: string;
  productInfo: string;
  customerNumber: string;
  quantity: number;
  targetUnitPrice: string;
  targetLeadTime: string;
  packaging: string;
}

function emptyRow(): BomRow {
  return {
    id: crypto.randomUUID(),
    partNumber: "",
    productInfo: "",
    customerNumber: "",
    quantity: 1,
    targetUnitPrice: "",
    targetLeadTime: "",
    packaging: "",
  };
}

interface BomState {
  rows: BomRow[];
  addRow: () => void;
  removeRow: (id: string) => void;
  updateRow: (id: string, patch: Partial<BomRow>) => void;
  deleteAll: () => void;
  setRows: (rows: BomRow[]) => void;
}

export const useBomStore = create<BomState>()(
  persist(
    (set, get) => ({
      rows: [emptyRow()],
      addRow: () => set({ rows: [...get().rows, emptyRow()] }),
      removeRow: (id) => set({ rows: get().rows.filter((r) => r.id !== id) }),
      updateRow: (id, patch) =>
        set({ rows: get().rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }),
      deleteAll: () => set({ rows: [emptyRow()] }),
      setRows: (rows) => set({ rows: rows.length ? rows : [emptyRow()] }),
    }),
    { name: "md-bom-draft" }
  )
);

export { emptyRow };
