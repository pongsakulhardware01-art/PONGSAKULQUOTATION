import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Boxes,
  Percent,
  Receipt,
  UserCheck,
  Building2,
  Calendar,
  FileText,
  CreditCard,
  Truck,
  Sparkles,
  Info,
  Users,
  Search,
  ArrowDownToLine,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
  Check,
} from 'lucide-react';
import {
  QuotationDocument,
  QuotationItem,
  QuotationStatus,
  DiscountType,
  VatType,
  CustomerRecord,
  CustomerInfo,
} from '../types';
import { formatCurrency, recalculateQuotation } from '../utils/formatters';

interface QuotationEditorProps {
  quote: QuotationDocument;
  onChange: (updated: QuotationDocument) => void;
  onOpenCatalog: () => void;
  customers?: CustomerRecord[];
  savedQuotes?: QuotationDocument[];
  onOpenCustomerDB?: () => void;
  onSaveCustomerToDB?: (customer: CustomerInfo) => Promise<void>;
  onGenerateNextNumber?: () => Promise<void>;
  isGeneratingNumber?: boolean;
}

const COMMON_UNITS = [
  'ตัว',
  'กล่อง',
  'ชุด',
  'ชิ้น',
  'อัน',
  'เส้น',
  'แผ่น',
  'ม้วน',
  'แกลลอน',
  'ถัง',
  'ปี๊บ',
  'เครื่อง',
  'คู่',
  'เมตร',
  'กิโลกรัม',
  'กระป๋อง',
  'งาน',
];

export const QuotationEditor: React.FC<QuotationEditorProps> = ({
  quote,
  onChange,
  onOpenCatalog,
  customers = [],
  savedQuotes = [],
  onOpenCustomerDB,
  onSaveCustomerToDB,
  onGenerateNextNumber,
  isGeneratingNumber,
}) => {
  const [refAlert, setRefAlert] = useState<string | null>(null);
  const [isRefDropdownOpen, setIsRefDropdownOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isSavingCust, setIsSavingCust] = useState(false);
  const [custSaveSuccess, setCustSaveSuccess] = useState(false);

  // Check if reference quote exists in saved quotes
  const matchedRefQuote = useMemo(() => {
    const ref = (quote.referenceNo || '').trim().toLowerCase();
    if (!ref) return null;
    return (
      savedQuotes.find(
        (q) => q.quoteNumber && q.quoteNumber.trim().toLowerCase() === ref
      ) || null
    );
  }, [quote.referenceNo, savedQuotes]);

  // Candidates for ref dropdown (searchable)
  const refQuoteOptions = useMemo(() => {
    return savedQuotes.filter((q) => q.quoteNumber !== quote.quoteNumber);
  }, [savedQuotes, quote.quoteNumber]);

  // Check if current customer matches any record in customer database
  const matchedCustomerInDB = useMemo(() => {
    const currentName = (quote.customer.companyName || quote.customer.name || '').trim().toLowerCase();
    const currentTaxId = (quote.customer.taxId || '').trim();
    if (!currentName && !currentTaxId) return null;
    return (
      customers.find(
        (c) =>
          (currentTaxId && c.taxId && c.taxId.trim() === currentTaxId) ||
          (currentName && c.name && c.name.trim().toLowerCase() === currentName) ||
          (currentName && c.companyName && c.companyName.trim().toLowerCase() === currentName)
      ) || null
    );
  }, [quote.customer, customers]);

  // Filtered customer suggestions
  const suggestedCustomers = useMemo(() => {
    const q = customerSearchQuery.trim().toLowerCase();
    if (!q) return customers.slice(0, 8);
    return customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.companyName && c.companyName.toLowerCase().includes(q)) ||
          (c.taxId && c.taxId.includes(q)) ||
          (c.phone && c.phone.includes(q))
      )
      .slice(0, 8);
  }, [customers, customerSearchQuery]);

  // Function to pull items & original prices from reference quotation
  const handleImportItemsFromRef = (source: QuotationDocument, copyCustomer = false) => {
    if (!source.items || source.items.length === 0) {
      alert('ใบเสนอราคานี้ไม่มีรายการสินค้า');
      return;
    }

    const clonedItems: QuotationItem[] = source.items.map((it, idx) => ({
      ...it,
      id: `item-${Date.now()}-${idx}`,
    }));

    const totals = recalculateQuotation(clonedItems, quote.settings);

    const updated: QuotationDocument = {
      ...quote,
      referenceNo: source.quoteNumber,
      items: clonedItems,
      ...totals,
      updatedAt: new Date().toISOString(),
    };

    if (copyCustomer && source.customer) {
      updated.customer = { ...source.customer };
    }
    if (source.paymentTerms) {
      updated.paymentTerms = source.paymentTerms;
    }
    if (source.deliveryTerms) {
      updated.deliveryTerms = source.deliveryTerms;
    }

    onChange(updated);
    setRefAlert(`✓ ดึงข้อมูล ${clonedItems.length} รายการและราคาเดิมจาก "${source.quoteNumber}" เรียบร้อยแล้ว`);
    setTimeout(() => setRefAlert(null), 6000);
    setIsRefDropdownOpen(false);
  };

  const handleSelectCustomer = (cust: CustomerRecord) => {
    const updatedCustomer: CustomerInfo = {
      name: cust.name,
      companyName: cust.companyName || cust.name,
      taxId: cust.taxId || '',
      branch: cust.branch || 'สำนักงานใหญ่',
      address: cust.address || '',
      contactPerson: cust.contactPerson || '',
      phone: cust.phone || '',
      email: cust.email || '',
    };
    onChange({
      ...quote,
      customer: updatedCustomer,
      updatedAt: new Date().toISOString(),
    });
    setIsCustomerDropdownOpen(false);
    setCustomerSearchQuery('');
  };

  const handleSaveCurrentCustomerToDB = async () => {
    if (!onSaveCustomerToDB) return;
    const name = (quote.customer.companyName || quote.customer.name || '').trim();
    if (!name) {
      alert('กรุณากรอกชื่อลูกค้าหรือชื่อบริษัทก่อนบันทึก');
      return;
    }
    setIsSavingCust(true);
    try {
      await onSaveCustomerToDB(quote.customer);
      setCustSaveSuccess(true);
      setTimeout(() => setCustSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลลูกค้า');
    } finally {
      setIsSavingCust(false);
    }
  };
  // Field updaters
  const updateQuote = (fields: Partial<QuotationDocument>) => {
    onChange({ ...quote, ...fields, updatedAt: new Date().toISOString() });
  };

  const updateCustomer = (field: string, value: string) => {
    const updatedCustomer = {
      ...quote.customer,
      [field]: value,
    };
    if (field === 'companyName') {
      updatedCustomer.name = value;
    }
    onChange({
      ...quote,
      customer: updatedCustomer,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateSettings = (field: string, value: any) => {
    onChange({
      ...quote,
      settings: { ...quote.settings, [field]: value },
      updatedAt: new Date().toISOString(),
    });
  };

  // Item handlers
  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...quote.items];
    const currentItem = { ...newItems[index], [field]: value };

    // Auto recalculate row total
    const qty = field === 'quantity' ? Number(value) || 0 : currentItem.quantity || 0;
    const price = field === 'unitPrice' ? Number(value) || 0 : currentItem.unitPrice || 0;
    const disc = field === 'discount' ? Number(value) || 0 : currentItem.discount || 0;
    const discType = field === 'discountType' ? value : currentItem.discountType;

    const base = qty * price;
    let discAmt = 0;
    if (discType === 'percent') {
      discAmt = base * (disc / 100);
    } else {
      discAmt = disc;
    }
    currentItem.total = Math.max(0, base - discAmt);
    newItems[index] = currentItem;

    updateQuote({ items: newItems });
  };

  const handleAddItem = () => {
    const newItem: QuotationItem = {
      id: 'item-' + Date.now(),
      sku: '',
      description: '',
      details: '',
      quantity: 1,
      unit: 'ชิ้น',
      unitPrice: 0,
      discount: 0,
      discountType: 'amount',
      total: 0,
    };
    updateQuote({ items: [...quote.items, newItem] });
  };

  const handleDeleteItem = (index: number) => {
    if (quote.items.length <= 1) {
      // Keep at least one blank row
      const blank: QuotationItem = {
        id: 'item-' + Date.now(),
        sku: '',
        description: '',
        details: '',
        quantity: 1,
        unit: 'ชิ้น',
        unitPrice: 0,
        discount: 0,
        discountType: 'amount',
        total: 0,
      };
      updateQuote({ items: [blank] });
      return;
    }
    const newItems = quote.items.filter((_, i) => i !== index);
    updateQuote({ items: newItems });
  };

  const handleDuplicateItem = (index: number) => {
    const itemToDup = quote.items[index];
    const duplicated: QuotationItem = {
      ...itemToDup,
      id: 'item-' + Date.now() + Math.random(),
    };
    const newItems = [...quote.items];
    newItems.splice(index + 1, 0, duplicated);
    updateQuote({ items: newItems });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === quote.items.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...quote.items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    updateQuote({ items: newItems });
  };

  const statusOptions: { value: QuotationStatus; label: string; color: string }[] = [
    { value: 'draft', label: 'ฉบับร่าง (Draft)', color: 'bg-stone-100 text-stone-700' },
    { value: 'pending', label: 'รออนุมัติ / เสนอลูกค้า (Pending)', color: 'bg-amber-100 text-amber-800' },
    { value: 'approved', label: 'ลูกค้ายืนยันอนุมัติ (Approved)', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'rejected', label: 'ไม่อนุมัติ / ยกเลิก (Rejected)', color: 'bg-rose-100 text-rose-800' },
    { value: 'expired', label: 'หมดอายุการเสนอราคา (Expired)', color: 'bg-stone-200 text-stone-600' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Document & Status Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">ข้อมูลใบเสนอราคา</h2>
              <p className="text-xs text-stone-500">เลขที่เอกสาร วันที่ และเงื่อนไขการจัดส่ง</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="quote-status-select" className="text-xs text-stone-500 font-medium hidden sm:inline">สถานะ:</label>
            <select
              id="quote-status-select"
              value={quote.status}
              onChange={(e) => updateQuote({ status: e.target.value as QuotationStatus })}
              className="text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-stone-300 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="quote-number-input" className="block text-xs font-medium text-stone-700">
                เลขที่ใบเสนอราคา <span className="text-red-500">*</span>
              </label>
              {onGenerateNextNumber && (
                <button
                  type="button"
                  onClick={onGenerateNextNumber}
                  disabled={isGeneratingNumber}
                  className="text-[11px] font-semibold text-red-700 hover:text-red-800 hover:bg-red-50 px-1.5 py-0.5 rounded transition flex items-center gap-1 cursor-pointer"
                  title="รันเลขที่ใบเสนอราคาถัดไปอัตโนมัติ (เช่น PKH-202610-0001)"
                >
                  <Sparkles className="w-3 h-3 text-red-600" />
                  <span>{isGeneratingNumber ? 'กำลังรัน...' : 'รันเลขถัดไป'}</span>
                </button>
              )}
            </div>
            <input
              id="quote-number-input"
              type="text"
              value={quote.quoteNumber}
              onChange={(e) => updateQuote({ quoteNumber: e.target.value })}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden font-mono font-medium"
              placeholder="เช่น PKH-202610-0001"
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="reference-no-input" className="block text-xs font-medium text-stone-700">
                เลขอ้างอิง / ดึงรายการเดิม
              </label>
              {savedQuotes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsRefDropdownOpen(!isRefDropdownOpen)}
                  className="text-[11px] font-medium text-stone-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  title="เลือกใบเสนอราคาเดิมเพื่อดึงรายการสินค้าและราคา"
                >
                  <FolderOpen className="w-3 h-3 text-stone-500" />
                  <span>เลือกใบเดิม</span>
                </button>
              )}
            </div>
            <input
              id="reference-no-input"
              type="text"
              value={quote.referenceNo || ''}
              onChange={(e) => updateQuote({ referenceNo: e.target.value })}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden font-mono"
              placeholder="เช่น PKH-202610-0001 หรือ PO-99"
            />

            {/* Dropdown for selecting prior quotes to reference */}
            {isRefDropdownOpen && refQuoteOptions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-stone-200 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-stone-100 animate-in fade-in">
                <div className="p-2 bg-stone-50 text-[11px] font-semibold text-stone-600 flex items-center justify-between">
                  <span>เลือกใบเสนอราคาเพื่อดึงรายการ & ราคาเดิม:</span>
                  <button
                    type="button"
                    onClick={() => setIsRefDropdownOpen(false)}
                    className="text-stone-400 hover:text-stone-700 text-xs"
                  >
                    ปิด
                  </button>
                </div>
                {refQuoteOptions.map((sq) => (
                  <button
                    key={sq.id}
                    type="button"
                    onClick={() => {
                      updateQuote({ referenceNo: sq.quoteNumber });
                      handleImportItemsFromRef(sq, false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-red-50/70 transition flex items-center justify-between text-xs cursor-pointer"
                  >
                    <div>
                      <span className="font-mono font-bold text-stone-900 block">{sq.quoteNumber}</span>
                      <span className="text-stone-500 text-[11px]">
                        {sq.customer.companyName || sq.customer.name || '-'}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-red-700 block">฿{formatCurrency(sq.grandTotal)}</span>
                      <span className="text-[10px] text-stone-400">{sq.items.length} รายการ</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="issue-date-input" className="block text-xs font-medium text-stone-700 mb-1">
              วันที่เสนอราคา <span className="text-red-500">*</span>
            </label>
            <input
              id="issue-date-input"
              type="date"
              value={quote.issueDate}
              onChange={(e) => updateQuote({ issueDate: e.target.value })}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
            />
          </div>

          <div>
            <label htmlFor="valid-until-input" className="block text-xs font-medium text-stone-700 mb-1">
              ยืนราคาถึงวันที่ <span className="text-red-500">*</span>
            </label>
            <input
              id="valid-until-input"
              type="date"
              value={quote.validUntil}
              onChange={(e) => updateQuote({ validUntil: e.target.value })}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="payment-terms-input" className="block text-xs font-medium text-stone-700 mb-1">
              เงื่อนไขการชำระเงิน
            </label>
            <input
              id="payment-terms-input"
              type="text"
              value={quote.paymentTerms}
              onChange={(e) => updateQuote({ paymentTerms: e.target.value })}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="เช่น โอนชำระเงินก่อนส่งสินค้า / เครดิต 30 วัน"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="delivery-terms-input" className="block text-xs font-medium text-stone-700 mb-1">
              กำหนดส่งมอบ / สถานที่ส่ง
            </label>
            <input
              id="delivery-terms-input"
              type="text"
              value={quote.deliveryTerms}
              onChange={(e) => updateQuote({ deliveryTerms: e.target.value })}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="เช่น จัดส่งภายใน 2-3 วันทำการ ถึงหน้างาน"
            />
          </div>

          {/* Matched Reference Quotation Banner & Pull Action */}
          {matchedRefQuote && (
            <div className="sm:col-span-2 md:col-span-4 p-3.5 bg-red-50/90 border border-red-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="text-xs">
                <div className="flex items-center gap-1.5 font-bold text-red-950">
                  <FileText className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    พบใบเสนอราคาเดิม: <strong className="font-mono text-red-700 text-sm">{matchedRefQuote.quoteNumber}</strong>
                  </span>
                </div>
                <p className="text-stone-600 mt-1">
                  ลูกค้า: <strong>{matchedRefQuote.customer.companyName || matchedRefQuote.customer.name || '-'}</strong> | {matchedRefQuote.items.length} รายการ (ยอดรวม ฿{formatCurrency(matchedRefQuote.grandTotal)})
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleImportItemsFromRef(matchedRefQuote, false)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                  title="ดึงเฉพาะรายการสินค้าและราคาเดิมใส่ใบนี้"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  ดึงรายการและราคาเดิม
                </button>
                <button
                  type="button"
                  onClick={() => handleImportItemsFromRef(matchedRefQuote, true)}
                  className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg text-xs font-medium transition cursor-pointer"
                  title="ดึงทั้งรายการสินค้า ราคาเดิม และข้อมูลลูกค้า/เงื่อนไข"
                >
                  ดึงพร้อมข้อมูลลูกค้า
                </button>
              </div>
            </div>
          )}

          {/* Reference Import Success Toast */}
          {refAlert && (
            <div className="sm:col-span-2 md:col-span-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {refAlert}
              </span>
              <button
                type="button"
                onClick={() => setRefAlert(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs px-2 py-0.5 rounded hover:bg-emerald-100 cursor-pointer"
              >
                ปิด
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Customer Information Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">ข้อมูลลูกค้า / ผู้รับใบเสนอราคา</h2>
              <p className="text-xs text-stone-500">ชื่อบริษัท ที่อยู่ออกใบกำกับภาษี และข้อมูลติดต่อ</p>
            </div>
          </div>

          {/* Customer Database Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {matchedCustomerInDB ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ตรงกับฐานลูกค้า</span>
              </span>
            ) : (quote.customer.companyName || quote.customer.name) ? (
              <button
                type="button"
                onClick={handleSaveCurrentCustomerToDB}
                disabled={isSavingCust}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 px-2.5 py-1 rounded-lg border border-stone-300 transition cursor-pointer"
                title="บันทึกข้อมูลลูกค้ารายนี้เข้าระบบฐานข้อมูลคลาวด์"
              >
                {custSaveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">บันทึกเรียบร้อย</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-stone-500" />
                    <span>{isSavingCust ? 'กำลังบันทึก...' : 'บันทึกลงฐานลูกค้า'}</span>
                  </>
                )}
              </button>
            ) : null}

            {onOpenCustomerDB && (
              <button
                type="button"
                onClick={onOpenCustomerDB}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition cursor-pointer"
                title="เปิดระบบจัดการฐานข้อมูลลูกค้า"
              >
                <Users className="w-3.5 h-3.5 text-red-600" />
                <span>ฐานข้อมูลลูกค้า ({customers.length})</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="sm:col-span-2 relative">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="customer-company-input" className="block text-xs font-medium text-stone-700">
                ชื่อลูกค้า / บริษัท / องค์กร
              </label>
              {customers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                  className="text-[11px] text-stone-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  title="ดูรายชื่อลูกค้าในฐานข้อมูล"
                >
                  <Search className="w-3 h-3 text-stone-400" />
                  <span>เลือกจากฐานลูกค้า</span>
                </button>
              )}
            </div>
            <input
              id="customer-company-input"
              type="text"
              value={quote.customer.companyName || quote.customer.name || ''}
              onChange={(e) => {
                updateCustomer('companyName', e.target.value);
                setCustomerSearchQuery(e.target.value);
                setIsCustomerDropdownOpen(true);
              }}
              onFocus={() => {
                if (customers.length > 0) setIsCustomerDropdownOpen(true);
              }}
              className="w-full text-sm font-semibold rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="ระบุชื่อลูกค้า หรือ พิมพ์เพื่อค้นหาจากฐานข้อมูล"
            />

            {/* Autocomplete suggestion popup */}
            {isCustomerDropdownOpen && suggestedCustomers.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-stone-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-stone-100 animate-in fade-in">
                <div className="p-2 bg-stone-50 text-[11px] font-semibold text-stone-600 flex items-center justify-between">
                  <span>เลือกรายชื่อลูกค้าจากฐานข้อมูล ({suggestedCustomers.length}):</span>
                  <button
                    type="button"
                    onClick={() => setIsCustomerDropdownOpen(false)}
                    className="text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                  >
                    ปิด
                  </button>
                </div>
                {suggestedCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCustomer(c)}
                    className="w-full text-left p-2.5 hover:bg-red-50/70 transition flex items-center justify-between text-xs cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-stone-900 block">{c.companyName || c.name}</span>
                      <span className="text-[11px] text-stone-500">
                        {c.taxId ? `Tax: ${c.taxId} ` : ''}
                        {c.phone ? `| โทร: ${c.phone}` : ''}
                        {c.contactPerson ? ` | ติดต่อ: ${c.contactPerson}` : ''}
                      </span>
                    </div>
                    <span className="text-[11px] text-red-600 font-medium shrink-0 ml-2">คลิกเพื่อใส่ข้อมูล</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="customer-tax-id-input" className="block text-xs font-medium text-stone-700 mb-1">
              เลขประจำตัวผู้เสียภาษี
            </label>
            <input
              id="customer-tax-id-input"
              type="text"
              value={quote.customer.taxId}
              onChange={(e) => updateCustomer('taxId', e.target.value)}
              className="w-full text-sm font-mono rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="เลข 13 หลัก"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3">
            <label htmlFor="customer-address-input" className="block text-xs font-medium text-stone-700 mb-1">
              ที่อยู่
            </label>
            <input
              id="customer-address-input"
              type="text"
              value={quote.customer.address}
              onChange={(e) => updateCustomer('address', e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="เลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
            />
          </div>

          <div>
            <label htmlFor="customer-branch-input" className="block text-xs font-medium text-stone-700 mb-1">
              สาขา
            </label>
            <input
              id="customer-branch-input"
              type="text"
              value={quote.customer.branch}
              onChange={(e) => updateCustomer('branch', e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="สำนักงานใหญ่ / สาขาที่ 00001"
            />
          </div>

          <div>
            <label htmlFor="customer-contact-input" className="block text-xs font-medium text-stone-700 mb-1">
              ชื่อผู้ติดต่อ / แผนก
            </label>
            <input
              id="customer-contact-input"
              type="text"
              value={quote.customer.contactPerson || ''}
              onChange={(e) => updateCustomer('contactPerson', e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="เช่น ฝ่ายจัดซื้อ / ผู้ประสานงาน"
            />
          </div>

          <div>
            <label htmlFor="customer-phone-input" className="block text-xs font-medium text-stone-700 mb-1">
              เบอร์โทรศัพท์
            </label>
            <input
              id="customer-phone-input"
              type="text"
              value={quote.customer.phone}
              onChange={(e) => updateCustomer('phone', e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="08X-XXX-XXXX หรือ 02-XXX-XXXX"
            />
          </div>

          <div>
            <label htmlFor="customer-email-input" className="block text-xs font-medium text-stone-700 mb-1">
              อีเมล
            </label>
            <input
              id="customer-email-input"
              type="email"
              value={quote.customer.email}
              onChange={(e) => updateCustomer('email', e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="buyer@customer.com"
            />
          </div>

          <div>
            <label htmlFor="salesperson-input" className="block text-xs font-medium text-stone-700 mb-1">
              ผู้เสนอราคา / พนักงานขาย
            </label>
            <input
              id="salesperson-input"
              type="text"
              value={quote.settings.salesperson}
              onChange={(e) => updateSettings('salesperson', e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="เช่น นายพงษ์สกุล / ฝ่ายขาย"
            />
          </div>

          <div>
            <label htmlFor="salesperson-phone-input" className="block text-xs font-medium text-stone-700 mb-1">
              เบอร์โทรผู้เสนอราคา
            </label>
            <input
              id="salesperson-phone-input"
              type="text"
              value={quote.settings.salespersonPhone}
              onChange={(e) => updateSettings('salespersonPhone', e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="081-890-5556"
            />
          </div>
        </div>
      </div>

      {/* 3. Items Table Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                รายการสินค้า / บริการ ({quote.items.length} รายการ)
              </h2>
              <p className="text-xs text-stone-500">ระบุรายละเอียด จำนวน ราคาต่อหน่วย และส่วนลด</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="catalog-picker-trigger-btn"
              onClick={onOpenCatalog}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>เลือกจากคลังสินค้าฮาร์ดแวร์</span>
            </button>
            <button
              id="add-item-row-btn"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มแถว</span>
            </button>
          </div>
        </div>

        {/* Item Rows */}
        <div className="space-y-3">
          {quote.items.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200 hover:border-stone-300 transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-stone-200 text-stone-700 text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.sku || ''}
                    onChange={(e) => handleItemChange(idx, 'sku', e.target.value)}
                    className="text-xs font-mono text-stone-600 bg-white border border-stone-300 rounded px-2 py-1 w-28 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-hidden"
                    placeholder="รหัส/SKU"
                  />
                </div>

                {/* Row action buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 rounded hover:bg-stone-200"
                    title="เลื่อนขึ้น"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveItem(idx, 'down')}
                    disabled={idx === quote.items.length - 1}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 rounded hover:bg-stone-200"
                    title="เลื่อนลง"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicateItem(idx)}
                    className="p-1 text-stone-500 hover:text-stone-800 rounded hover:bg-stone-200"
                    title="คัดลอกแถวนี้"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(idx)}
                    className="p-1 text-stone-400 hover:text-red-600 rounded hover:bg-red-50"
                    title="ลบแถวนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                {/* Description & Sub-details */}
                <div className="md:col-span-5 space-y-1.5">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="w-full text-sm font-medium rounded-lg px-3 py-1.5 bg-white border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
                    placeholder="ชื่อรายการสินค้า / บริการ *"
                  />
                  <input
                    type="text"
                    value={item.details || ''}
                    onChange={(e) => handleItemChange(idx, 'details', e.target.value)}
                    className="w-full text-xs text-stone-600 rounded-lg px-3 py-1 bg-white border border-stone-200 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-hidden"
                    placeholder="รายละเอียดสเปก หรือคุณสมบัติเพิ่มเติม (ถ้ามี)"
                  />
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="block md:hidden text-[10px] font-medium text-stone-500 mb-0.5">
                    จำนวน
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-mono text-center rounded-lg px-2 py-1.5 bg-white border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
                    placeholder="จำนวน"
                  />
                </div>

                {/* Unit */}
                <div className="md:col-span-1">
                  <label className="block md:hidden text-[10px] font-medium text-stone-500 mb-0.5">
                    หน่วย
                  </label>
                  <input
                    list={`units-list-${idx}`}
                    type="text"
                    value={item.unit}
                    onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                    className="w-full text-xs text-center rounded-lg px-1.5 py-1.5 bg-white border border-stone-300 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-hidden"
                    placeholder="หน่วย"
                  />
                  <datalist id={`units-list-${idx}`}>
                    {COMMON_UNITS.map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>
                </div>

                {/* Unit Price */}
                <div className="md:col-span-2">
                  <label className="block md:hidden text-[10px] font-medium text-stone-500 mb-0.5">
                    ราคา/หน่วย (บาท)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.unitPrice === 0 ? '' : item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-mono text-right rounded-lg px-2.5 py-1.5 bg-white border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
                      placeholder="ราคา"
                    />
                  </div>
                </div>

                {/* Row Total */}
                <div className="md:col-span-2 flex flex-col justify-center text-right">
                  <span className="text-[10px] text-stone-400 font-medium">รวมเป็นเงิน</span>
                  <span className="text-sm font-bold font-mono text-stone-900">
                    ฿{formatCurrency(item.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Row Button at bottom */}
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-stone-100">
          <button
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 py-1 px-2.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มรายการถัดไป</span>
          </button>
          <span className="text-xs text-stone-500">
            ยอดรวมรายการทั้งหมด: <strong className="text-stone-800">฿{formatCurrency(quote.subtotal)}</strong>
          </span>
        </div>
      </div>

      {/* 4. Financial Calculations & Tax Settings Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">การคิดภาษี ส่วนลด และค่าจัดส่ง</h2>
            <p className="text-xs text-stone-500">กำหนดภาษีมูลค่าเพิ่ม (VAT 7%) ภาษีหัก ณ ที่จ่าย และส่วนลดพิเศษ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Overall Discount */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              ส่วนลดพิเศษท้ายบิล
            </label>
            <div className="flex">
              <input
                type="number"
                min="0"
                step="any"
                value={quote.settings.overallDiscount || ''}
                onChange={(e) => updateSettings('overallDiscount', parseFloat(e.target.value) || 0)}
                className="w-full text-sm font-mono rounded-l-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
                placeholder="0"
              />
              <select
                value={quote.settings.overallDiscountType}
                onChange={(e) => updateSettings('overallDiscountType', e.target.value as DiscountType)}
                className="text-xs font-semibold bg-stone-100 border border-l-0 border-stone-300 rounded-r-lg px-2 focus:ring-2 focus:ring-red-500 outline-hidden"
              >
                <option value="amount">฿ (บาท)</option>
                <option value="percent">%</option>
              </select>
            </div>
          </div>

          {/* Shipping Fee */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              ค่าขนส่ง / จัดส่ง (บาท)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={quote.settings.shippingFee || ''}
              onChange={(e) => updateSettings('shippingFee', parseFloat(e.target.value) || 0)}
              className="w-full text-sm font-mono rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
              placeholder="0 (ส่งฟรี)"
            />
          </div>

          {/* VAT Type */}
          <div>
            <label htmlFor="vat-type-select" className="block text-xs font-medium text-stone-700 mb-1">
              ภาษีมูลค่าเพิ่ม (VAT)
            </label>
            <select
              id="vat-type-select"
              value={quote.settings.vatType}
              onChange={(e) => updateSettings('vatType', e.target.value as VatType)}
              className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden"
            >
              <option value="exclude">คิด VAT 7% เพิ่มจากยอด (มาตรฐาน)</option>
              <option value="include">ราคารวม VAT 7% แล้ว</option>
              <option value="none">ไม่มีภาษีมูลค่าเพิ่ม (0%)</option>
            </select>
          </div>

          {/* Withholding Tax */}
          <div>
            <label htmlFor="wht-rate-select" className="block text-xs font-medium text-stone-700 mb-1">
              หักภาษี ณ ที่จ่าย (WHT)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="wht-enabled-toggle"
                type="checkbox"
                checked={quote.settings.withholdingTaxEnabled}
                onChange={(e) => updateSettings('withholdingTaxEnabled', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-stone-300 focus:ring-red-500"
              />
              <select
                id="wht-rate-select"
                disabled={!quote.settings.withholdingTaxEnabled}
                value={quote.settings.withholdingTaxRate}
                onChange={(e) => updateSettings('withholdingTaxRate', parseFloat(e.target.value) || 3)}
                className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 bg-white disabled:bg-stone-100 disabled:text-stone-400 focus:ring-2 focus:ring-red-500 outline-hidden"
              >
                <option value={1}>1% (ค่าขนส่ง)</option>
                <option value={2}>2% (ค่าโฆษณา)</option>
                <option value={3}>3% (ค่าบริการ / ค่าจ้าง)</option>
                <option value={5}>5% (ค่าเช่า)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Calculation Summary Banner */}
        <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <span className="block text-xs text-stone-500">ยอดรวมสินค้า</span>
              <span className="text-sm font-bold font-mono text-stone-800">
                ฿{formatCurrency(quote.subtotal)}
              </span>
            </div>
            <div>
              <span className="block text-xs text-stone-500">ภาษีมูลค่าเพิ่ม 7%</span>
              <span className="text-sm font-bold font-mono text-red-700">
                ฿{formatCurrency(quote.vatAmount)}
              </span>
            </div>
            <div>
              <span className="block text-xs text-stone-500">ค่าจัดส่ง</span>
              <span className="text-sm font-bold font-mono text-stone-800">
                ฿{formatCurrency(quote.shippingAmount)}
              </span>
            </div>
            <div>
              <span className="block text-xs text-stone-500">จำนวนเงินรวมทั้งสิ้น</span>
              <span className="text-base font-extrabold font-mono text-red-600">
                ฿{formatCurrency(quote.grandTotal)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-200 text-center">
            <span className="text-xs text-stone-500">จำนวนเงินตัวอักษร: </span>
            <strong className="text-xs sm:text-sm text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200 inline-block font-semibold">
              ({quote.thaiBahtText})
            </strong>
          </div>
        </div>
      </div>

      {/* 5. Terms & Conditions and Bank Details */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">เงื่อนไขการค้า และข้อมูลการชำระเงิน</h2>
            <p className="text-xs text-stone-500">ข้อกำหนดการรับประกัน ส่งของ และบัญชีธนาคารสำหรับโอนเงิน</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="terms-input" className="block text-xs font-medium text-stone-700 mb-1">
              เงื่อนไขและข้อตกลง (Terms & Conditions)
            </label>
            <textarea
              id="terms-input"
              rows={4}
              value={quote.terms}
              onChange={(e) => updateQuote({ terms: e.target.value })}
              className="w-full text-xs rounded-lg p-3 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden leading-relaxed"
              placeholder="ระบุเงื่อนไข..."
            />
          </div>

          <div>
            <label htmlFor="notes-input" className="block text-xs font-medium text-stone-700 mb-1">
              หมายเหตุเพิ่มเติม (Notes / Remarks)
            </label>
            <textarea
              id="notes-input"
              rows={4}
              value={quote.notes}
              onChange={(e) => updateQuote({ notes: e.target.value })}
              className="w-full text-xs rounded-lg p-3 border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-hidden leading-relaxed"
              placeholder="ข้อความขอบคุณ หรือคำแนะนำสำหรับลูกค้า..."
            />
          </div>
        </div>

        {/* Display Toggles for Signatures, Bank & Visual Comfort */}
        <div className="mt-4 pt-3 border-t border-stone-100 space-y-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={quote.settings.showBankAccounts}
                onChange={(e) => updateSettings('showBankAccounts', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-stone-300 focus:ring-red-500"
              />
              <span className="text-stone-700">แสดงเลขที่บัญชีธนาคารในเอกสาร</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={quote.settings.showSignatureArea}
                onChange={(e) => updateSettings('showSignatureArea', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-stone-300 focus:ring-red-500"
              />
              <span className="text-stone-700">แสดงช่องลายเซ็นและตราประทับ</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={quote.settings.showSkuColumn !== false}
                onChange={(e) => updateSettings('showSkuColumn', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-stone-300 focus:ring-red-500"
              />
              <span className="text-stone-700">แสดงคอลัมน์รหัสสินค้า (SKU)</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100">
            <span className="text-stone-500 font-medium">สไตล์เอกสาร:</span>
            <select
              value={quote.settings.templateStyle || 'clean-modern'}
              onChange={(e) => updateSettings('templateStyle', e.target.value)}
              className="text-xs rounded-lg px-2.5 py-1.5 border border-stone-300 bg-white font-medium text-stone-800 focus:ring-2 focus:ring-red-500"
            >
              <option value="clean-modern">🌟 คลีน โมเดิร์น (สบายตา)</option>
              <option value="classic-red">🏢 คลาสสิก ฮาร์ดแวร์</option>
              <option value="minimal-slate">📄 มินิมอล โมโนโครม</option>
            </select>

            <span className="text-stone-500 font-medium ml-2">ระยะห่างตาราง:</span>
            <select
              value={quote.settings.tableDensity || 'comfortable'}
              onChange={(e) => updateSettings('tableDensity', e.target.value)}
              className="text-xs rounded-lg px-2.5 py-1.5 border border-stone-300 bg-white font-medium text-stone-800 focus:ring-2 focus:ring-red-500"
            >
              <option value="comfortable">โปร่ง สบายตา (แนะนำ)</option>
              <option value="compact">กะทัดรัด</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
