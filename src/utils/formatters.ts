import { QuotationDocument, QuotationItem, QuotationSettings } from '../types';
import { thaiBahtText } from './thaiBahtText';

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0.00';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(amount: number | undefined | null, decimals = 0): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatThaiDate(dateString: string, formatType: 'full' | 'short' | 'slash' = 'short'): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate();
    const month = date.getMonth();
    const yearCE = date.getFullYear();
    const yearBE = yearCE + 543;

    const thaiMonthsShort = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const thaiMonthsFull = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    if (formatType === 'slash') {
      const dd = String(day).padStart(2, '0');
      const mm = String(month + 1).padStart(2, '0');
      return `${dd}/${mm}/${yearBE}`;
    }

    if (formatType === 'full') {
      return `${day} ${thaiMonthsFull[month]} พ.ศ. ${yearBE}`;
    }

    return `${day} ${thaiMonthsShort[month]} ${yearBE}`;
  } catch {
    return dateString;
  }
}

export function generateQuoteNumber(prefix = 'QT'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomSuffix = String(Math.floor(100 + Math.random() * 900));
  return `${prefix}-${year}${month}-${randomSuffix}`;
}

export function calculateItemTotal(item: QuotationItem): number {
  const baseTotal = (item.quantity || 0) * (item.unitPrice || 0);
  let discountAmt = 0;
  if (item.discountType === 'percent') {
    discountAmt = baseTotal * ((item.discount || 0) / 100);
  } else {
    discountAmt = item.discount || 0;
  }
  return Math.max(0, baseTotal - discountAmt);
}

export function recalculateQuotation(
  items: QuotationItem[],
  settings: QuotationSettings
): {
  subtotal: number;
  itemDiscountTotal: number;
  afterItemDiscount: number;
  overallDiscountAmount: number;
  netBeforeTax: number;
  vatAmount: number;
  withholdingTaxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  thaiBahtText: string;
} {
  let subtotal = 0;
  let itemDiscountTotal = 0;

  items.forEach((item) => {
    const rawItemBase = (item.quantity || 0) * (item.unitPrice || 0);
    let itemDisc = 0;
    if (item.discountType === 'percent') {
      itemDisc = rawItemBase * ((item.discount || 0) / 100);
    } else {
      itemDisc = item.discount || 0;
    }
    subtotal += rawItemBase;
    itemDiscountTotal += itemDisc;
  });

  const afterItemDiscount = Math.max(0, subtotal - itemDiscountTotal);

  let overallDiscountAmount = 0;
  if (settings.overallDiscountType === 'percent') {
    overallDiscountAmount = afterItemDiscount * ((settings.overallDiscount || 0) / 100);
  } else {
    overallDiscountAmount = settings.overallDiscount || 0;
  }

  const baseForTaxAndShipping = Math.max(0, afterItemDiscount - overallDiscountAmount);
  const shippingAmount = Number(settings.shippingFee) || 0;

  let netBeforeTax = baseForTaxAndShipping;
  let vatAmount = 0;

  const vatRate = settings.vatRate || 7;

  if (settings.vatType === 'exclude') {
    // ภาษีมูลค่าเพิ่ม 7% คิดเพิ่มจากยอดรวม (บวกเพิ่ม)
    vatAmount = (netBeforeTax + shippingAmount) * (vatRate / 100);
  } else if (settings.vatType === 'include') {
    // ราคารวมภาษีแล้ว (ถอด VAT)
    const totalWithShipping = netBeforeTax + shippingAmount;
    vatAmount = totalWithShipping - (totalWithShipping / (1 + (vatRate / 100)));
    netBeforeTax = totalWithShipping - vatAmount;
  } else {
    // ไม่มีภาษี
    vatAmount = 0;
  }

  let withholdingTaxAmount = 0;
  if (settings.withholdingTaxEnabled && settings.withholdingTaxRate > 0) {
    // หัก ณ ที่จ่าย คำนวณจากยอดก่อนภาษี
    withholdingTaxAmount = netBeforeTax * (settings.withholdingTaxRate / 100);
  }

  let grandTotal = 0;
  if (settings.vatType === 'exclude') {
    grandTotal = netBeforeTax + shippingAmount + vatAmount - withholdingTaxAmount;
  } else if (settings.vatType === 'include') {
    grandTotal = (netBeforeTax + vatAmount) - withholdingTaxAmount;
  } else {
    grandTotal = netBeforeTax + shippingAmount - withholdingTaxAmount;
  }

  grandTotal = Math.max(0, grandTotal);

  const text = thaiBahtText(grandTotal);

  return {
    subtotal,
    itemDiscountTotal,
    afterItemDiscount,
    overallDiscountAmount,
    netBeforeTax,
    vatAmount,
    withholdingTaxAmount,
    shippingAmount,
    grandTotal,
    thaiBahtText: text,
  };
}
