export function bulkDiscountRate(quantity: number): number {
  if (quantity > 20000) return 0.16;
  if (quantity > 10000) return 0.1;
  if (quantity > 5000) return 0.05;
  return 0;
}

export function calculateLineTotal(unitPriceINR: number, quantity: number) {
  const discount = bulkDiscountRate(quantity);
  const gross = unitPriceINR * quantity;
  const discountAmount = gross * discount;
  return { discount, gross, discountAmount, total: gross - discountAmount };
}
