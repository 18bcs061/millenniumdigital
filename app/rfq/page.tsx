"use client";

import { Info } from "lucide-react";
import { BomUpload } from "@/components/rfq/BomUpload";
import { RfqSteps } from "@/components/rfq/RfqSteps";
import { BomTable } from "@/components/rfq/BomTable";
import { RfqForm } from "@/components/rfq/RfqForm";
import { useBomStore } from "@/lib/stores/bom-store";

export default function RfqPage() {
  const rows = useBomStore((s) => s.rows);
  const hasParts = rows.some((r) => r.partNumber.trim());
  const currentStep = hasParts ? 1 : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 md:text-3xl">Request Quote / BOM Quote</h1>
        <p className="text-sm text-slate-500">Upload a parts list or add rows manually to request production-volume pricing.</p>
      </div>

      <div className="mb-6">
        <BomUpload />
      </div>

      <div className="mb-6">
        <RfqSteps current={currentStep} />
      </div>

      <div className="mb-4">
        <h2 className="mb-3 font-heading text-lg font-extrabold text-slate-900">Parts / BOM Table</h2>
        <BomTable />
      </div>

      <div className="mb-8 flex items-start gap-2 rounded-xl bg-brand-secondary/5 p-4 text-sm text-slate-600">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" />
        Provide as much detail as possible (target price, lead time, packaging) so our sourcing team can return the most accurate quote. Quotes are typically processed within 1-2 business days.
      </div>

      <RfqForm />
    </div>
  );
}
