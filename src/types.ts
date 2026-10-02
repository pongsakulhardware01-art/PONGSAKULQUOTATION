export type QuotationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';

export type DiscountType = 'percent' | 'amount';
export type VatType = 'include' | 'exclude' | 'none';

export interface CompanyProfile {
  nameTh: string;
  nameEn: string;
  taxId: string;
  branch: string;
  address: string;
  phone: string;
  email: string;
  lineId: string;
  website?: string;
  logoUrl?: string;
}

export interface CustomerInfo {
  name: string;
  companyName: string;
  taxId: string;
  branch: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  companyName?: string;
  taxId?: string;
  branch?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  notes?: string;
  quoteCount?: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface QuotationItem {
  id: string;
  sku?: string;
  description: string;
  details?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountType: DiscountType;
  total: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch?: string;
  isDefault?: boolean;
}

export type QuotationTemplateStyle = 'clean-modern' | 'classic-red' | 'minimal-slate';
export type TableDensity = 'comfortable' | 'compact';
export type PreviewFontSize = 'normal' | 'large';
export type LogoStyle = 'concrete-banner' | 'concrete-icon' | 'hardware-hex' | 'none';

export interface QuotationSettings {
  vatType: VatType; // 'exclude' (7% added), 'include' (price includes VAT), 'none'
  vatRate: number; // default 7
  withholdingTaxEnabled: boolean;
  withholdingTaxRate: number; // 1%, 2%, 3%, 5%
  overallDiscount: number;
  overallDiscountType: DiscountType;
  shippingFee: number;
  currency: string;
  showSignatureArea: boolean;
  showStampArea: boolean;
  showBankAccounts: boolean;
  salesperson: string;
  salespersonPhone: string;
  salespersonEmail: string;
  // Visual & Comfort settings
  templateStyle?: QuotationTemplateStyle;
  tableDensity?: TableDensity;
  fontSize?: PreviewFontSize;
  showSkuColumn?: boolean;
  showItemDetails?: boolean;
  logoStyle?: LogoStyle;
}

export interface QuotationDocument {
  id: string;
  quoteNumber: string;
  revision?: number; // 0 = Rev.00, 1 = Rev.01, 2 = Rev.02, etc.
  revisionNote?: string; // e.g. 'แก้ไขราคาตามต่อรอง', 'เพิ่มรายการ'
  referenceNo?: string;
  issueDate: string; // YYYY-MM-DD
  validUntil: string; // YYYY-MM-DD
  paymentTerms: string; // e.g., 'เครดิต 30 วัน' หรือ 'เงินสด / โอนชำระทันที'
  deliveryTerms: string; // e.g., 'จัดส่งภายใน 3-5 วันทำการ'
  status: QuotationStatus;
  
  company: CompanyProfile;
  customer: CustomerInfo;
  items: QuotationItem[];
  
  settings: QuotationSettings;
  bankAccounts: BankAccount[];
  notes: string;
  terms: string;
  
  // Computed summary
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
  
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isCloudSynced?: boolean;
}

export interface ProductPreset {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  description?: string;
}
