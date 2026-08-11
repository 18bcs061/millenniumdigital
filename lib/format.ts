/**
 * Locale-pinned formatting helpers. Client Components render once on the server
 * (for the initial HTML) and once on the client (hydration) — if either call
 * relies on the runtime's *default* locale (e.g. `n.toLocaleString()` with no
 * locale argument), a server/browser locale mismatch produces a React hydration
 * error. Always pin an explicit locale so both passes produce identical output.
 */

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatDate(input: string | Date, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleDateString("en-US", options);
}
