import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

const MAX_SIZE = 4 * 1024 * 1024;

interface ParsedRow {
  id: string;
  partNumber: string;
  productInfo: string;
  customerNumber: string;
  quantity: number;
  targetUnitPrice: string;
  targetLeadTime: string;
  packaging: string;
}

function toRow(cells: string[]): ParsedRow {
  return {
    id: crypto.randomUUID(),
    partNumber: cells[0] ?? "",
    productInfo: cells[1] ?? "",
    customerNumber: cells[2] ?? "",
    quantity: Number(cells[3]) || 1,
    targetUnitPrice: cells[4] ?? "",
    targetLeadTime: cells[5] ?? "",
    packaging: cells[6] ?? "",
  };
}

function parseCsv(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")));
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds the 4MB size limit." }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let rows: string[][];

    if (name.endsWith(".csv")) {
      rows = parseCsv(buffer.toString("utf-8"));
    } else if (name.endsWith(".xlsx")) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
      const sheet = workbook.worksheets[0];
      rows = [];
      sheet.eachRow((row) => {
        rows.push((row.values as unknown[]).slice(1).map((v) => (v === null || v === undefined ? "" : String(v))));
      });
    } else if (name.endsWith(".xls")) {
      return NextResponse.json({ error: "Legacy .xls files aren't supported — please re-save as .xlsx or .csv." }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Unsupported file type. Please upload .xls, .xlsx, or .csv." }, { status: 400 });
    }

    // Drop a header row if the first cell looks like a text label rather than a part number.
    const [first, ...rest] = rows;
    const body = first && /part|mpn|lcsc/i.test(first[0] ?? "") ? rest : rows;

    const parsed = body.filter((r) => r.some((c) => c && c.trim())).map(toRow);

    if (parsed.length === 0) {
      return NextResponse.json({ error: "No rows found in the uploaded file." }, { status: 400 });
    }

    return NextResponse.json({ rows: parsed });
  } catch {
    return NextResponse.json({ error: "Could not parse the file. Please check the format and try again." }, { status: 400 });
  }
}
