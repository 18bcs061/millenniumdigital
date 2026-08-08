/**
 * One-time conversion: reads the source catalog spreadsheet (data/catalog.xlsx)
 * and emits prisma/seed-data/{categories,brands,products}.json so the Prisma
 * seed script has an exact, typo-free copy of the real spreadsheet contents.
 *
 * Run with: npm run build:seed-data
 */
import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "data", "catalog.xlsx");
const OUT_DIR = path.join(process.cwd(), "prisma", "seed-data");

function sheetToObjects(worksheet: ExcelJS.Worksheet): Record<string, unknown>[] {
  const rows = worksheet.getSheetValues(); // 1-indexed, first element empty
  const header = (rows[1] as unknown[]).map((h) => String(h ?? "").trim());
  const records: Record<string, unknown>[] = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i] as unknown[] | undefined;
    if (!row) continue;
    const record: Record<string, unknown> = {};
    let hasValue = false;
    header.forEach((key, idx) => {
      if (!key) return;
      const cell = row[idx];
      const value = cell && typeof cell === "object" && "text" in (cell as object)
        ? (cell as { text: string }).text
        : cell;
      if (value !== undefined && value !== null && value !== "") hasValue = true;
      record[key] = value ?? null;
    });
    if (hasValue) records.push(record);
  }
  return records;
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(SRC);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const sheetMap: Record<string, string> = {
    Categories: "categories.json",
    Brands: "brands.json",
    Products: "products.json",
  };

  for (const [sheetName, fileName] of Object.entries(sheetMap)) {
    const ws = workbook.getWorksheet(sheetName);
    if (!ws) {
      console.warn(`Sheet "${sheetName}" not found in ${SRC}`);
      continue;
    }
    const records = sheetToObjects(ws);
    fs.writeFileSync(path.join(OUT_DIR, fileName), JSON.stringify(records, null, 2));
    console.log(`Wrote ${records.length} records -> prisma/seed-data/${fileName}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
