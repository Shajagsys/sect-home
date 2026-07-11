export interface ProposalItem {
  description: string;
  qty: number;
  unit_price: number;
}

export function computeTotals(items: ProposalItem[], taxPercent: number, discountPercent: number) {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unit_price, 0);
  const discount = (subtotal * discountPercent) / 100;
  const taxable = subtotal - discount;
  const tax = (taxable * taxPercent) / 100;
  return { subtotal, discount, tax, total: taxable + tax };
}
