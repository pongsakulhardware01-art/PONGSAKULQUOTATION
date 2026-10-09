import { BankAccount, CompanyProfile, ProductPreset, QuotationDocument, QuotationItem } from '../types';
import { generateQuoteNumber, recalculateQuotation } from '../utils/formatters';

export const DEFAULT_COMPANY: CompanyProfile = {
  nameTh: 'บริษัท พงษ์สกุล ฮาร์ดแวร์ จำกัด',
  nameEn: 'PONGSAKUL HARDWARE COMPANY LIMITED',
  taxId: '0115562005556',
  branch: 'สำนักงานใหญ่',
  address: '619/1 ถนนสุขุมวิท ตำบลปากน้ำ อำเภอเมืองสมุทรปราการ จ.สมุทรปราการ 10270',
  phone: '',
  email: '',
  lineId: '',
  website: '',
  logoUrl: '',
};

export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'ธนาคารกสิกรไทย (KBANK)',
    accountNumber: '123-2-55567-8',
    accountName: 'บจก. พงษ์สกุล ฮาร์ดแวร์',
    branch: 'สาขาปากน้ำ สมุทรปราการ',
    isDefault: true,
  },
  {
    id: 'bank-2',
    bankName: 'ธนาคารกรุงเทพ (BBL)',
    accountNumber: '155-0-98765-4',
    accountName: 'บจก. พงษ์สกุล ฮาร์ดแวร์',
    branch: 'สาขาสมุทรปราการ',
    isDefault: false,
  },
  {
    id: 'bank-3',
    bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
    accountNumber: '045-3-11556-9',
    accountName: 'บจก. พงษ์สกุล ฮาร์ดแวร์',
    branch: 'สาขาถนนสุขุมวิท (ปากน้ำ)',
    isDefault: false,
  },
];

export const HARDWARE_PRODUCT_CATALOG: ProductPreset[] = [
  {
    id: 'p-1',
    sku: 'HW-SCR-001',
    name: 'สกรูเกลียวปล่อย หัวเตเปอร์ สแตนเลส 304 ขนาด #8 x 1 นิ้ว',
    category: 'น็อต-สกรู-พุก',
    unit: 'กล่อง (100 ตัว)',
    unitPrice: 160,
    description: 'ผลิตจากสแตนเลสเกรด 304 ทนทาน ไม่เป็นสนิม เหมาะสำหรับงานช่างทั่วไป',
  },
  {
    id: 'p-2',
    sku: 'HW-SCR-002',
    name: 'พุกพลาสติก เบอร์ 7 พร้อมสกรูเกลียวปล่อย',
    category: 'น็อต-สกรู-พุก',
    unit: 'ชุด (100 ชิ้น)',
    unitPrice: 85,
    description: 'สำหรับเจาะยึดผนังปูน งานติดตั้งอุปกรณ์ไฟฟ้าและเฟอร์นิเจอร์',
  },
  {
    id: 'p-3',
    sku: 'HW-TL-001',
    name: 'สว่านกระแทกไร้สาย 20V ไร้แปรงถ่าน (Brushless)',
    category: 'เครื่องมือช่างไฟฟ้า',
    unit: 'ชุด',
    unitPrice: 2850,
    description: 'พร้อมแบตเตอรี่ลิเธียม 4.0Ah 2 ก้อน แท่นชาร์จเร็ว และกล่องเก็บอุปกรณ์',
  },
  {
    id: 'p-4',
    sku: 'HW-TL-002',
    name: 'เครื่องเจียร 4 นิ้ว 850 วัตต์ สวิตช์ท้าย',
    category: 'เครื่องมือช่างไฟฟ้า',
    unit: 'เครื่อง',
    unitPrice: 1290,
    description: 'มอเตอร์ทองแดงแท้ ทนความร้อนสูง แถมฟรีใบเจียรหนา 2 ใบ',
  },
  {
    id: 'p-5',
    sku: 'HW-BLD-001',
    name: 'ใบตัดเหล็ก/สแตนเลส 4 นิ้ว บาง 1.0 มม. Extra Thin',
    category: 'อุปกรณ์ขัด-ตัด',
    unit: 'กล่อง (50 ใบ)',
    unitPrice: 450,
    description: 'ตัดคม ไร้รอยไหม้ ไม่แตกหักง่าย มาตรฐานความปลอดภัย EN12413',
  },
  {
    id: 'p-6',
    sku: 'HW-BLD-002',
    name: 'ใบเพชรตัดคอนกรีต/หินอ่อน 4 นิ้ว เทอร์โบ',
    category: 'อุปกรณ์ขัด-ตัด',
    unit: 'ใบ',
    unitPrice: 195,
    description: 'ฟันเพชรเกรดสูง ตัดได้ทั้งแบบแห้งและน้ำ คอนกรีต กระเบื้อง แกรนิต',
  },
  {
    id: 'p-7',
    sku: 'HW-WLD-001',
    name: 'ลวดเชื่อมเหล็กเหนียว E6013 ขนาด 2.6 x 350 มม. (กล่อง 2 กก.)',
    category: 'อุปกรณ์งานเชื่อม',
    unit: 'กล่อง',
    unitPrice: 220,
    description: 'เชื่อมนิ่ม สแล็กร่อนง่าย ควันน้อย แนวเชื่อมสวยงาม',
  },
  {
    id: 'p-8',
    sku: 'HW-WLD-002',
    name: 'ถุงมือหนังสำหรับงานเชื่อม ทนความร้อน ซับในนุ่ม',
    category: 'อุปกรณ์ความปลอดภัย',
    unit: 'คู่',
    unitPrice: 140,
    description: 'หนังแท้คุณภาพสูง ทนสะเก็ดไฟและความร้อน สวมใส่กระชับมือ',
  },
  {
    id: 'p-9',
    sku: 'HW-PNT-001',
    name: 'สีรองพื้นกันสนิม สีแดงซิงค์ฟอสเฟต (แกลลอน 3.785 ลิตร)',
    category: 'เคมีภัณฑ์และสี',
    unit: 'แกลลอน',
    unitPrice: 480,
    description: 'ป้องกันการเกิดสนิมเหล็กโครงสร้าง แห้งตัวไว ยึดเกาะพื้นผิวโลหะดีเยี่ยม',
  },
  {
    id: 'p-10',
    sku: 'HW-PNT-002',
    name: 'ทินเนอร์ผสมสีเกรด AAA (ปี๊บ 11 กก.)',
    category: 'เคมีภัณฑ์และสี',
    unit: 'ปี๊บ',
    unitPrice: 620,
    description: 'สำหรับล้างอุปกรณ์และเจือจางสีน้ำมัน แลกเกอร์ และสีพ่นอุตสาหกรรม',
  },
  {
    id: 'p-11',
    sku: 'HW-PIP-001',
    name: 'ท่อ PVC สีฟ้า ชั้น 8.5 ขนาด 3/4 นิ้ว (ยาว 4 เมตร)',
    category: 'ท่อและอุปกรณ์ประปา',
    unit: 'เส้น',
    unitPrice: 58,
    description: 'มาตรฐาน มอก. สำหรับระบบส่งน้ำประปาและงานเกษตร',
  },
  {
    id: 'p-12',
    sku: 'HW-PIP-002',
    name: 'บอลวาล์วทองเหลือง ด้ามโยก ขนาด 1/2 นิ้ว',
    category: 'ท่อและอุปกรณ์ประปา',
    unit: 'ตัว',
    unitPrice: 110,
    description: 'ทองเหลืองแท้ ทนแรงดันสูง ไม่เป็นสนิม เปิด-ปิดง่าย น้ำไม่รั่วซึม',
  },
  {
    id: 'p-13',
    sku: 'HW-ELC-001',
    name: 'สายไฟทองแดง THW 1x2.5 ตร.มม. มอก. (ม้วน 100 เมตร)',
    category: 'อุปกรณ์ไฟฟ้า',
    unit: 'ม้วน',
    unitPrice: 1150,
    description: 'สายเดี่ยวแกนทองแดงแท้ ฉนวน PVC ทนแรงดัน 450/750V มาตรฐาน TIS',
  },
  {
    id: 'p-14',
    sku: 'HW-LUB-001',
    name: 'น้ำมันอเนกประสงค์ หล่อลื่น-ไล่ความชื้น ขนาด 400 มล.',
    category: 'เคมีภัณฑ์และสี',
    unit: 'กระป๋อง',
    unitPrice: 165,
    description: 'คลายเกลียวน็อตสนิม หล่อลื่นชิ้นส่วนโลหะ ป้องกันสนิม ไล่ความชื้นในระบบไฟฟ้า',
  },
];

export const DEFAULT_TERMS = `1. ราคานี้ ยืนราคาภายใน 30 วัน นับจากวันที่เสนอราคา
2. กำหนดส่งของ: ภายใน 2-5 วันทำการ หลังจากได้รับใบสั่งซื้อ (PO) หรือยืนยันคำสั่งซื้อ
3. การชำระเงิน: โอนชำระเงินเข้าบัญชีบริษัทฯ หรือตามเงื่อนไขที่ตกลง
4. สินค้าจัดส่งฟรีในเขตจังหวัดสมุทรปราการและกรุงเทพฯ สำหรับยอดสั่งซื้อ 5,000 บาทขึ้นไป
5. สินค้าซื้อแล้วพบปัญหาจากการผลิต สามารถเปลี่ยนหรือเคลมได้ภายใน 7 วันพร้อมใบเสร็จ`;

export const DEFAULT_NOTES = `ขอขอบพระคุณที่ให้ความไว้วางใจในสินค้าและบริการของ บริษัท พงษ์สกุล ฮาร์ดแวร์ จำกัด
หากท่านมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม กรุณาติดต่อฝ่ายขายได้ตลอดเวลา`;

export function createInitialQuotation(): QuotationDocument {
  const today = new Date();
  const validDate = new Date();
  validDate.setDate(today.getDate() + 30);

  const initialItems: QuotationItem[] = [
    {
      id: 'item-1',
      sku: 'HW-TL-001',
      description: 'สว่านกระแทกไร้สาย 20V ไร้แปรงถ่าน (Brushless)',
      details: 'พร้อมแบตเตอรี่ลิเธียม 4.0Ah 2 ก้อน และแท่นชาร์จเร็ว',
      quantity: 2,
      unit: 'ชุด',
      unitPrice: 2850,
      discount: 5,
      discountType: 'percent',
      total: 5415,
    },
    {
      id: 'item-2',
      sku: 'HW-BLD-001',
      description: 'ใบตัดเหล็ก/สแตนเลส 4 นิ้ว บาง 1.0 มม. Extra Thin',
      details: 'มาตรฐาน EN12413 คม ทนทาน ไม่แตกหักง่าย',
      quantity: 10,
      unit: 'กล่อง (50 ใบ)',
      unitPrice: 450,
      discount: 0,
      discountType: 'amount',
      total: 4500,
    },
    {
      id: 'item-3',
      sku: 'HW-PNT-001',
      description: 'สีรองพื้นกันสนิม สีแดงซิงค์ฟอสเฟต (แกลลอน 3.785 ลิตร)',
      details: 'ป้องกันสนิมโครงสร้างเหล็ก ทนแดด ทนฝน',
      quantity: 4,
      unit: 'แกลลอน',
      unitPrice: 480,
      discount: 100,
      discountType: 'amount',
      total: 1820,
    },
    {
      id: 'item-4',
      sku: 'HW-SCR-001',
      description: 'สกรูเกลียวปล่อย หัวเตเปอร์ สแตนเลส 304 (#8 x 1 นิ้ว)',
      details: 'สแตนเลสเกรด 304 ไม่เป็นสนิม',
      quantity: 5,
      unit: 'กล่อง (100 ตัว)',
      unitPrice: 160,
      discount: 0,
      discountType: 'percent',
      total: 800,
    },
  ];

  const settings = {
    vatType: 'exclude' as const, // VAT 7%
    vatRate: 7,
    withholdingTaxEnabled: false,
    withholdingTaxRate: 3,
    overallDiscount: 0,
    overallDiscountType: 'amount' as const,
    shippingFee: 0,
    currency: 'THB',
    showSignatureArea: true,
    showStampArea: true,
    showBankAccounts: true,
    salesperson: 'ฝ่ายขาย / นิติการ',
    salespersonPhone: '',
    salespersonEmail: '',
    templateStyle: 'clean-modern' as const,
    tableDensity: 'comfortable' as const,
    fontSize: 'normal' as const,
    showSkuColumn: true,
    showItemDetails: true,
    logoStyle: 'concrete-banner' as const,
    showWatermark: true,
    watermarkStyle: 'logo-diagonal' as const,
    watermarkOpacity: 0.05,
  };

  const totals = recalculateQuotation(initialItems, settings);

  return {
    id: 'quote-' + Date.now(),
    quoteNumber: generateQuoteNumber('PKH'),
    revision: 0,
    revisionNote: '',
    referenceNo: 'PO-REF-2026-001',
    issueDate: today.toISOString().split('T')[0],
    validUntil: validDate.toISOString().split('T')[0],
    paymentTerms: 'โอนชำระเงิน / เครดิต 30 วัน',
    deliveryTerms: 'จัดส่งถึงหน้างานภายใน 2-3 วันทำการ',
    status: 'draft',

    company: { ...DEFAULT_COMPANY },
    customer: {
      name: '',
      companyName: '',
      taxId: '',
      branch: '',
      address: '',
      contactPerson: '',
      phone: '',
      email: '',
    },
    items: initialItems,
    settings,
    bankAccounts: [...DEFAULT_BANK_ACCOUNTS],
    notes: DEFAULT_NOTES,
    terms: DEFAULT_TERMS,

    ...totals,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
