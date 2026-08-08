export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string; rateFromINR: number }[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee", rateFromINR: 1 },
  { code: "USD", symbol: "$", label: "US Dollar", rateFromINR: 1 / 87 },
  { code: "EUR", symbol: "€", label: "Euro", rateFromINR: 1 / 94 },
  { code: "GBP", symbol: "£", label: "British Pound", rateFromINR: 1 / 110 },
];

export function getCurrency(code: CurrencyCode) {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Static demo conversion rates — not live FX. Base amounts are always stored/priced in INR. */
export function convertFromINR(amountINR: number, code: CurrencyCode): number {
  return amountINR * getCurrency(code).rateFromINR;
}

export function formatMoney(amountINR: number, code: CurrencyCode): string {
  const converted = convertFromINR(amountINR, code);
  return new Intl.NumberFormat(code === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency: code,
    maximumFractionDigits: code === "INR" ? 0 : 2,
  }).format(converted);
}
