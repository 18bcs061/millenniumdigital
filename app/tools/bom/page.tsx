"use client";

import { BomUpload } from "@/components/rfq/BomUpload";
import { RfqSteps } from "@/components/rfq/RfqSteps";
import { BomTable } from "@/components/rfq/BomTable";
import { RfqForm } from "@/components/rfq/RfqForm";
import { useBomStore } from "@/lib/stores/bom-store";

export default function ToolsBomPage() {
  const rows = useBomStore((s) => s.rows);
  const hasParts = rows.some((r) => r.partNumber.trim());

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <h1 className="mb-1 font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">BOM Tools</h1>
      <p className="mb-6 text-sm text-slate-500">The same BOM/RFQ workflow from the RFQ tab, available here for quick access.</p>

      <div className="mb-6"><BomUpload /></div>
      <div className="mb-6"><RfqSteps current={hasParts ? 1 : 0} /></div>
      <div className="mb-8">
        <h2 className="mb-3 font-heading text-lg font-extrabold text-slate-900">Parts / BOM Table</h2>
        <BomTable />
      </div>
      <RfqForm />
    </div>
  );
}
