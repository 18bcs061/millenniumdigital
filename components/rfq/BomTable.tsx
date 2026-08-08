"use client";

import { Plus, Trash2, ListX } from "lucide-react";
import { useBomStore, type BomRow } from "@/lib/stores/bom-store";

const COLUMNS: { key: keyof Omit<BomRow, "id">; label: string; type?: string }[] = [
  { key: "partNumber", label: "LCSC / Manufacturer Part #" },
  { key: "productInfo", label: "Product Info" },
  { key: "customerNumber", label: "Customer #" },
  { key: "quantity", label: "Quantity", type: "number" },
  { key: "targetUnitPrice", label: "Target Unit Price" },
  { key: "targetLeadTime", label: "Target Lead Time" },
  { key: "packaging", label: "Packaging" },
];

export function BomTable() {
  const { rows, addRow, removeRow, updateRow, deleteAll } = useBomStore();

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-3 py-2.5">{col.label}</th>
              ))}
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                {COLUMNS.map((col) => (
                  <td key={col.key} className="px-2 py-1.5">
                    <input
                      type={col.type ?? "text"}
                      min={col.type === "number" ? 1 : undefined}
                      value={row[col.key] as string | number}
                      onChange={(e) =>
                        updateRow(row.id, {
                          [col.key]: col.type === "number" ? Number(e.target.value) : e.target.value,
                        })
                      }
                      className="w-full min-w-[110px] rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm outline-none focus:border-brand-primary focus:bg-white"
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5">
                  <button onClick={() => removeRow(row.id)} className="rounded-full p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={addRow} className="flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/5 px-4 py-2 text-xs font-bold text-brand-primary hover:bg-brand-primary/10">
          <Plus className="h-3.5 w-3.5" /> Add Row
        </button>
        <button onClick={deleteAll} className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 hover:border-rose-300 hover:text-rose-500">
          <ListX className="h-3.5 w-3.5" /> Delete All
        </button>
      </div>
    </div>
  );
}
