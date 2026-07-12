/** Indian GST computation helpers. */

export interface GstItem {
  description: string;
  hsn_sac: string;
  qty: number;
  unit_price: number;
  gst_rate: number; // 0 | 5 | 12 | 18 | 28
}

export const GST_RATES = [0, 5, 12, 18, 28];

export interface GstTotals {
  subtotal: number;
  discount: number;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  total: number;
  /** taxable + tax grouped by GST rate — the GSTR-1/3B style rate-wise break-up */
  byRate: { rate: number; taxable: number; cgst: number; sgst: number; igst: number }[];
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Computes an invoice's GST break-up. Intra-state supplies split the rate into
 * CGST + SGST halves; inter-state supplies charge full IGST. The discount is
 * applied proportionally to every line before tax.
 */
export function computeGst(
  items: GstItem[],
  discountPercent: number,
  interState: boolean
): GstTotals {
  const subtotal = r2(items.reduce((sum, item) => sum + item.qty * item.unit_price, 0));
  const discountFactor = 1 - (discountPercent || 0) / 100;
  const rateMap = new Map<number, { taxable: number; cgst: number; sgst: number; igst: number }>();

  let taxable = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  for (const item of items) {
    const lineTaxable = r2(item.qty * item.unit_price * discountFactor);
    const lineGst = r2((lineTaxable * (item.gst_rate || 0)) / 100);
    const bucket = rateMap.get(item.gst_rate) || { taxable: 0, cgst: 0, sgst: 0, igst: 0 };
    bucket.taxable = r2(bucket.taxable + lineTaxable);
    taxable = r2(taxable + lineTaxable);
    if (interState) {
      bucket.igst = r2(bucket.igst + lineGst);
      igst = r2(igst + lineGst);
    } else {
      bucket.cgst = r2(bucket.cgst + lineGst / 2);
      bucket.sgst = r2(bucket.sgst + lineGst / 2);
      cgst = r2(cgst + lineGst / 2);
      sgst = r2(sgst + lineGst / 2);
    }
    rateMap.set(item.gst_rate, bucket);
  }

  const totalGst = r2(cgst + sgst + igst);
  return {
    subtotal,
    discount: r2(subtotal - taxable),
    taxable,
    cgst,
    sgst,
    igst,
    totalGst,
    total: r2(taxable + totalGst),
    byRate: Array.from(rateMap.entries())
      .map(([rate, v]) => ({ rate, ...v }))
      .sort((a, b) => a.rate - b.rate),
  };
}

/** Indian financial year label for a date, e.g. 2026-05-01 → "2026-27". */
export function financialYear(date: Date = new Date()): string {
  const y = date.getFullYear();
  const startYear = date.getMonth() >= 3 ? y : y - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
}

/** Amount in words using the Indian numbering system (lakh / crore). */
export function amountInWordsINR(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function twoDigits(n: number): string {
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]}${n % 10 ? ' ' + ones[n % 10] : ''}`;
  }
  function threeDigits(n: number): string {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    return `${h ? ones[h] + ' Hundred' : ''}${h && rest ? ' ' : ''}${rest ? twoDigits(rest) : ''}`;
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  if (rupees === 0 && paise === 0) return 'Zero Rupees Only';

  let n = rupees;
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;

  const parts: string[] = [];
  if (crore) parts.push(`${twoDigits(crore) || threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (n) parts.push(threeDigits(n));

  let words = parts.length ? `${parts.join(' ')} Rupees` : '';
  if (paise) words += `${words ? ' and ' : ''}${twoDigits(paise)} Paise`;
  return `${words} Only`;
}

/** Parse and validate GST line items from an API request body. */
export function parseGstItems(raw: unknown): GstItem[] | { error: string } {
  const items: GstItem[] = [];
  for (const entry of (Array.isArray(raw) ? raw : []).slice(0, 100)) {
    const item = entry as Record<string, unknown>;
    const description = String(item.description || '').trim().slice(0, 300);
    if (!description) continue;
    const qty = Number(item.qty);
    const unitPrice = Number(item.unit_price);
    const gstRate = Number(item.gst_rate);
    if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
      return { error: `Invalid quantity or price for "${description}"` };
    }
    if (!GST_RATES.includes(gstRate)) {
      return { error: `Invalid GST rate for "${description}"` };
    }
    items.push({
      description,
      hsn_sac: String(item.hsn_sac || '').trim().slice(0, 10),
      qty,
      unit_price: unitPrice,
      gst_rate: gstRate,
    });
  }
  if (items.length === 0) return { error: 'At least one line item is required' };
  return items;
}

/** GST Indian state codes (for place of supply dropdowns). */
export const GST_STATES: { code: string; name: string }[] = [
  { code: '01', name: 'Jammu & Kashmir' }, { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' }, { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' }, { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' }, { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' }, { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' }, { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' }, { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' }, { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' }, { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' }, { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' }, { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' }, { code: '24', name: 'Gujarat' },
  { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', name: 'Maharashtra' }, { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' }, { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' }, { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' }, { code: '35', name: 'Andaman & Nicobar Islands' },
  { code: '36', name: 'Telangana' }, { code: '37', name: 'Andhra Pradesh' },
  { code: '38', name: 'Ladakh' },
];

export function stateName(code: string): string {
  return GST_STATES.find((s) => s.code === code)?.name || code;
}
