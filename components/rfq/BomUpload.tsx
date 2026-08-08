"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { UploadCloud, FileDown, FolderOpen, Loader2 } from "lucide-react";
import { useBomStore } from "@/lib/stores/bom-store";

const MAX_SIZE = 4 * 1024 * 1024;

export function BomUpload() {
  const setRows = useBomStore((s) => s.setRows);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_SIZE) {
      setError("File exceeds the 4MB size limit.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/rfq/parse-bom", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not parse file.");
      setRows(data.rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not parse file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragOver ? "border-brand-primary bg-brand-primary/5" : "border-slate-300 hover:border-brand-primary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xls,.xlsx,.csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {loading ? <Loader2 className="h-8 w-8 animate-spin text-brand-primary" /> : <UploadCloud className="h-8 w-8 text-brand-primary" />}
        <p className="font-heading text-sm font-bold text-slate-800">{loading ? "Parsing your file..." : "Drag & drop your BOM file, or click to browse"}</p>
        <p className="text-xs text-slate-400">Supports .xls, .xlsx, .csv — max file size 4MB</p>
      </div>

      {error && <p className="mt-2 text-sm font-semibold text-rose-500">{error}</p>}

      <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
        <a href="/bom-template.csv" download className="flex items-center gap-1.5 text-brand-primary hover:underline">
          <FileDown className="h-3.5 w-3.5" /> Download BOM Template
        </a>
        <Link href="/rfq/lists" className="flex items-center gap-1.5 text-brand-secondary hover:underline">
          <FolderOpen className="h-3.5 w-3.5" /> View BOM Lists (Projects)
        </Link>
      </div>
    </div>
  );
}
