import React from 'react';
import { QuotationDocument } from '../types';
import { formatCurrency, formatThaiDate } from '../utils/formatters';
import { LogoEmblem } from './LogoEmblem';
import { WatermarkOverlay } from './WatermarkOverlay';
import { Building2, Phone, Mail, FileText, CreditCard, ShieldCheck, MapPin } from 'lucide-react';

interface QuotationPreviewProps {
  quote: QuotationDocument;
  isExportMode?: boolean;
  containerId?: string;
}

export const QuotationPreview: React.FC<QuotationPreviewProps> = ({
  quote,
  isExportMode = false,
  containerId = 'printable-quotation-a4',
}) => {
  const company = quote.company;
  const customer = quote.customer;
  const settings = quote.settings || {};

  const templateStyle = settings.templateStyle || 'clean-modern';
  const tableDensity = settings.tableDensity || 'comfortable';
  const fontSize = settings.fontSize || 'normal';
  const showSku = settings.showSkuColumn !== false;
  const showDetails = settings.showItemDetails !== false;
  const logoStyle = settings.logoStyle || 'concrete-banner';
  const showWatermark = settings.showWatermark !== false;
  const watermarkStyle = settings.watermarkStyle || 'logo-diagonal';
  const watermarkOpacity =
    settings.watermarkOpacity === 0.08 || settings.watermarkOpacity === undefined
      ? 0.055
      : settings.watermarkOpacity;

  // Spacing & Font sizing classes
  const isLargeText = fontSize === 'large';
  const isComfortable = tableDensity === 'comfortable';

  // Base font size scaling
  const baseTextClass = isLargeText ? 'text-[12px]' : 'text-[11.5px]';
  const headingTextClass = isLargeText ? 'text-xl' : 'text-lg';
  const tablePaddingClass = isComfortable ? 'py-3 px-3' : 'py-2 px-2.5';

  // Customer sanitize
  const rawCustomerName = (customer.companyName || customer.name || '').trim();
  const customerDisplayName =
    rawCustomerName && !rawCustomerName.includes('สมชาย')
      ? rawCustomerName
      : '';
  const contactPersonDisplay =
    customer.contactPerson && !customer.contactPerson.includes('สมชาย')
      ? customer.contactPerson
      : '';
  const customerEmailDisplay =
    customer.email && !customer.email.includes('somchai')
      ? customer.email
      : '';

  const wrapperClass = isExportMode
    ? 'w-[794px] bg-white flex justify-center'
    : 'w-full flex justify-center py-2 sm:py-6';

  const containerClass = isExportMode
    ? `relative overflow-hidden bg-white w-[794px] min-h-[1123px] p-8 text-stone-900 rounded-none ${baseTextClass} leading-normal flex flex-col justify-between`
    : `relative overflow-hidden a4-page bg-white w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-10 shadow-lg border border-stone-200 text-stone-900 rounded-sm ${baseTextClass} leading-normal flex flex-col justify-between`;

  return (
    <div className={wrapperClass}>
      {/* Standard A4 Printable Page Container */}
      <div
        id={containerId}
        style={isExportMode ? { width: '794px', minHeight: '1123px', boxSizing: 'border-box' } : undefined}
        className={containerClass}
      >
        <div className="relative z-10">
          {/* ========================================================
              1. HEADER SECTION (Clean, High Clarity, Crisp Logo)
              ======================================================== */}
          {templateStyle === 'clean-modern' && (
            <div className="pb-5 border-b border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                {/* Company Info & Logo (Left) */}
                <div className="flex flex-col gap-3 max-w-[62%]">
                  {/* Brand Logo Display */}
                  {logoStyle !== 'none' && (
                    <div className="pt-0.5">
                      {logoStyle === 'concrete-banner' && !company.logoUrl ? (
                        <LogoEmblem
                          size="banner-md"
                          variant="full-banner"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <LogoEmblem
                            size="lg"
                            variant={logoStyle === 'hardware-hex' ? 'hardware-hex' : 'icon-only'}
                            customLogoUrl={company.logoUrl}
                          />
                          {!company.logoUrl && logoStyle === 'concrete-icon' && (
                            <div>
                              <div className="font-extrabold text-red-700 text-lg leading-tight tracking-tight">
                                Pongsakul Hardware
                              </div>
                              <div className="text-[10px] font-bold text-stone-800 tracking-wider">
                                {company.nameTh}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Registered Company details */}
                  <div className="text-[10.5px] text-stone-600 space-y-1 leading-relaxed">
                    <div className="font-bold text-stone-900 text-xs">
                      {company.nameTh}{' '}
                      <span className="font-normal text-stone-500 text-[10px]">
                        ({company.nameEn})
                      </span>
                    </div>

                    <p className="flex items-center gap-1.5">
                      <span className="font-semibold text-stone-800">เลขประจำตัวผู้เสียภาษี:</span>
                      <span className="font-mono font-bold text-stone-900 tracking-wide">
                        {company.taxId}
                      </span>
                      <span className="text-stone-500">
                        ({company.branch || 'สำนักงานใหญ่'})
                      </span>
                    </p>

                    <p className="text-stone-600 leading-snug">
                      <span className="font-medium text-stone-700">ที่อยู่:</span> {company.address}
                    </p>
                  </div>
                </div>

                {/* Quotation Document Pill & Meta (Right) */}
                <div className="flex flex-col sm:items-end justify-start text-left sm:text-right">
                  {/* Badge Header */}
                  <div className="bg-red-700 text-white px-5 py-2 rounded-xl shadow-xs mb-3 text-center sm:text-right">
                    <span className="text-base sm:text-lg font-bold tracking-wide block leading-tight">
                      ใบเสนอราคา
                    </span>
                    <span className="text-[9.5px] font-semibold tracking-widest text-red-200 uppercase">
                      QUOTATION
                    </span>
                  </div>

                  {/* Meta Details Box */}
                  <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-3 text-[11px] space-y-1.5 w-full sm:w-auto min-w-[195px]">
                    <div className="flex justify-between sm:justify-end gap-3">
                      <span className="text-stone-500">เลขที่เอกสาร:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-red-700 tracking-wide">
                        <span>{quote.quoteNumber}</span>
                        {quote.revision !== undefined && quote.revision > 0 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                            Rev.{String(quote.revision).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    </div>
                    {quote.revision !== undefined && quote.revision > 0 && (
                      <div className="flex justify-between sm:justify-end gap-2 text-[10px]">
                        <span className="text-stone-500">แก้ไขครั้งที่:</span>
                        <span className="font-semibold text-stone-800">
                          Rev. {String(quote.revision).padStart(2, '0')}
                          {quote.revisionNote ? ` (${quote.revisionNote})` : ''}
                        </span>
                      </div>
                    )}
                    {quote.referenceNo && (
                      <div className="flex justify-between sm:justify-end gap-3">
                        <span className="text-stone-500">เลขที่อ้างอิง:</span>
                        <span className="font-mono text-stone-800">{quote.referenceNo}</span>
                      </div>
                    )}
                    <div className="flex justify-between sm:justify-end gap-3">
                      <span className="text-stone-500">วันที่ออก:</span>
                      <span className="font-medium text-stone-800">
                        {formatThaiDate(quote.issueDate, 'slash')}
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-end gap-3 pt-1 border-t border-stone-200">
                      <span className="text-stone-500">ยืนราคาถึง:</span>
                      <span className="font-bold text-red-600">
                        {formatThaiDate(quote.validUntil, 'slash')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {templateStyle === 'classic-red' && (
            <div className="pb-4 border-b-2 border-red-600">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-col gap-2 max-w-[65%]">
                  {logoStyle !== 'none' && (
                    <div className="pt-0.5">
                      <LogoEmblem
                        size="banner-md"
                        variant={logoStyle === 'hardware-hex' ? 'hardware-hex' : 'full-banner'}
                        customLogoUrl={company.logoUrl}
                      />
                    </div>
                  )}
                  <div>
                    <h1 className={`${headingTextClass} font-bold text-red-700 leading-tight`}>
                      {company.nameTh}
                    </h1>
                    <h2 className="text-[10.5px] font-semibold text-stone-700 tracking-wide uppercase">
                      {company.nameEn}
                    </h2>
                    <div className="mt-1 text-[10px] text-stone-600 space-y-0.5">
                      <p>
                        <span className="font-semibold text-stone-800">เลขประจำตัวผู้เสียภาษี:</span>{' '}
                        <span className="font-mono font-bold">{company.taxId}</span> ({company.branch || 'สำนักงานใหญ่'})
                      </p>
                      <p>{company.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-left sm:text-right">
                  <div className="bg-red-700 text-white px-5 py-1.5 rounded shadow-xs mb-2">
                    <span className="text-base font-bold tracking-wider">ใบเสนอราคา</span>
                    <span className="block text-[9px] font-medium tracking-widest text-red-200">QUOTATION</span>
                  </div>
                  <div className="text-[10.5px] space-y-0.5 font-medium">
                    <p>
                      <span className="text-stone-500">เลขที่:</span>{' '}
                      <strong className="font-mono text-red-700">{quote.quoteNumber}</strong>
                      {quote.revision !== undefined && quote.revision > 0 && (
                        <span className="ml-1.5 text-[9.5px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                          Rev.{String(quote.revision).padStart(2, '0')}
                        </span>
                      )}
                    </p>
                    {quote.revision !== undefined && quote.revision > 0 && (
                      <p className="text-[10px]">
                        <span className="text-stone-500">แก้ไขครั้งที่:</span>{' '}
                        <strong className="text-stone-800">
                          Rev. {String(quote.revision).padStart(2, '0')}
                          {quote.revisionNote ? ` (${quote.revisionNote})` : ''}
                        </strong>
                      </p>
                    )}
                    {quote.referenceNo && <p><span className="text-stone-500">อ้างอิง:</span> <span className="font-mono">{quote.referenceNo}</span></p>}
                    <p><span className="text-stone-500">วันที่:</span> {formatThaiDate(quote.issueDate, 'slash')}</p>
                    <p><span className="text-stone-500">ยืนราคาถึง:</span> <strong className="text-red-700">{formatThaiDate(quote.validUntil, 'slash')}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {templateStyle === 'minimal-slate' && (
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-300">
              <div className="flex flex-col gap-2 max-w-[65%]">
                {logoStyle !== 'none' && (
                  <LogoEmblem
                    size="banner-sm"
                    variant="full-banner"
                    customLogoUrl={company.logoUrl}
                  />
                )}
                <div>
                  <h1 className={`${headingTextClass} font-bold text-stone-900 leading-tight`}>
                    {company.nameTh}
                  </h1>
                  <h2 className="text-[10px] font-medium text-stone-500 tracking-wider uppercase">
                    {company.nameEn}
                  </h2>
                  <div className="mt-1 text-[10px] text-stone-600 space-y-0.5">
                    <p>เลขประจำตัวผู้เสียภาษี: <span className="font-mono font-medium">{company.taxId}</span> ({company.branch || 'สำนักงานใหญ่'})</p>
                    <p>{company.address}</p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <h2 className="text-lg font-bold text-stone-900 tracking-wide">ใบเสนอราคา</h2>
                <span className="text-[10px] text-stone-400 font-mono tracking-widest block -mt-1 mb-2 uppercase">QUOTATION</span>
                <div className="text-[10.5px] space-y-0.5 text-stone-600">
                  <p>
                    เลขที่: <span className="font-mono font-bold text-stone-900">{quote.quoteNumber}</span>
                    {quote.revision !== undefined && quote.revision > 0 && (
                      <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                        Rev.{String(quote.revision).padStart(2, '0')}
                      </span>
                    )}
                  </p>
                  {quote.revision !== undefined && quote.revision > 0 && (
                    <p className="text-[10px]">
                      แก้ไขครั้งที่: <strong className="text-stone-800">Rev. {String(quote.revision).padStart(2, '0')}{quote.revisionNote ? ` (${quote.revisionNote})` : ''}</strong>
                    </p>
                  )}
                  <p>วันที่: <span className="font-medium">{formatThaiDate(quote.issueDate, 'slash')}</span></p>
                  <p>ยืนราคาถึง: <span className="font-medium text-red-700">{formatThaiDate(quote.validUntil, 'slash')}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              2. CUSTOMER & TERMS INFO (Spacious, Clean Box)
              ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 my-4 bg-stone-50/70 p-4 rounded-xl border border-stone-200/80">
            {/* Customer Box (Col 1-7) */}
            <div className="sm:col-span-7 space-y-1.5 pr-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-stone-200 pb-3 sm:pb-0">
              <div className="flex items-center gap-1.5 text-red-700 font-bold text-[11px] tracking-wide uppercase">
                <Building2 className="w-3.5 h-3.5 text-red-600" />
                <span>ข้อมูลลูกค้า / Customer Details</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-stone-900 pt-0.5 leading-snug">
                {customerDisplayName || '-'}
              </p>
              {customer.taxId && (
                <p className="text-[10.5px] text-stone-600">
                  <span className="text-stone-500">เลขประจำตัวผู้เสียภาษี:</span>{' '}
                  <span className="font-mono font-semibold text-stone-900">{customer.taxId}</span>{' '}
                  <span className="text-stone-500">({customer.branch || 'สำนักงานใหญ่'})</span>
                </p>
              )}
              <p className="text-[10.5px] text-stone-600 leading-relaxed">
                <span className="text-stone-500">ที่อยู่:</span> {customer.address || '-'}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-stone-600 pt-0.5">
                {contactPersonDisplay && (
                  <p>
                    <span className="text-stone-500">ผู้ติดต่อ:</span>{' '}
                    <span className="font-semibold text-stone-800">{contactPersonDisplay}</span>
                  </p>
                )}
                {customer.phone && (
                  <p>
                    <span className="text-stone-500">โทร:</span>{' '}
                    <span className="font-mono font-medium text-stone-800">{customer.phone}</span>
                  </p>
                )}
                {customerEmailDisplay && (
                  <p>
                    <span className="text-stone-500">อีเมล:</span>{' '}
                    <span className="text-stone-800">{customerEmailDisplay}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Terms Box (Col 8-12) */}
            <div className="sm:col-span-5 space-y-1.5 pl-0 sm:pl-2 text-[10.5px]">
              <div className="flex items-center gap-1.5 text-stone-700 font-bold text-[11px] tracking-wide uppercase">
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>เงื่อนไขและผู้ดูแล / Conditions</span>
              </div>
              <div className="space-y-1.5 pt-0.5">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-stone-500 flex-shrink-0">การชำระเงิน:</span>
                  <span className="font-semibold text-stone-800 text-right">
                    {quote.paymentTerms || 'เงินสด / โอนชำระ'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-stone-500 flex-shrink-0">กำหนดส่งมอบ:</span>
                  <span className="font-semibold text-stone-800 text-right">
                    {quote.deliveryTerms || 'ตามตกลง'}
                  </span>
                </div>
                {settings.salesperson && (
                  <div className="flex justify-between items-baseline gap-2 pt-1 border-t border-stone-200">
                    <span className="text-stone-500 flex-shrink-0">ผู้เสนอราคา:</span>
                    <span className="font-medium text-stone-800 text-right">
                      {settings.salesperson}
                      {settings.salespersonPhone && (
                        <span className="text-stone-600 font-mono text-[10px] block">
                          โทร: {settings.salespersonPhone}
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================
              3. ITEMS TABLE (Clean, Spacious, Effortless Reading)
              ======================================================== */}
          <div className="overflow-hidden border border-stone-200 rounded-xl shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-100/90 text-stone-800 text-[11px] font-semibold border-b-2 border-red-600">
                  <th className="py-2.5 px-2.5 text-center w-10 text-stone-600">#</th>
                  {showSku && (
                    <th className="py-2.5 px-3 w-26 text-stone-700">รหัสสินค้า</th>
                  )}
                  <th className="py-2.5 px-3 text-stone-800">รายการสินค้า / รายละเอียด</th>
                  <th className="py-2.5 px-2.5 text-center w-16 text-stone-800">จำนวน</th>
                  <th className="py-2.5 px-2.5 text-center w-16 text-stone-700">หน่วย</th>
                  <th className="py-2.5 px-3 text-right w-26 text-stone-800">ราคา/หน่วย</th>
                  <th className="py-2.5 px-2 text-right w-16 text-stone-700">ส่วนลด</th>
                  <th className="py-2.5 px-3.5 text-right w-28 text-red-700 font-bold">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80 bg-white">
                {quote.items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 1 ? 'bg-stone-50/40' : 'bg-white'}
                  >
                    {/* Row Index */}
                    <td className={`${tablePaddingClass} text-center text-stone-400 font-mono text-[10.5px]`}>
                      {index + 1}
                    </td>

                    {/* SKU */}
                    {showSku && (
                      <td className={`${tablePaddingClass} font-mono text-[10.5px] text-stone-500 font-medium`}>
                        {item.sku || '-'}
                      </td>
                    )}

                    {/* Description & Details */}
                    <td className={`${tablePaddingClass}`}>
                      <div className="font-semibold text-stone-900 leading-snug">
                        {item.description || '-'}
                      </div>
                      {showDetails && item.details && (
                        <div className="text-[10px] text-stone-500 font-normal leading-relaxed mt-0.5">
                          {item.details}
                        </div>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className={`${tablePaddingClass} text-center font-mono font-bold text-stone-800`}>
                      {item.quantity}
                    </td>

                    {/* Unit */}
                    <td className={`${tablePaddingClass} text-center text-stone-600 text-[10.5px]`}>
                      {item.unit}
                    </td>

                    {/* Unit Price */}
                    <td className={`${tablePaddingClass} text-right font-mono text-stone-800 font-medium`}>
                      {formatCurrency(item.unitPrice)}
                    </td>

                    {/* Item Discount */}
                    <td className={`${tablePaddingClass} text-right font-mono text-stone-500 text-[10.5px]`}>
                      {item.discount > 0 ? (
                        <span className="text-amber-700 font-medium">
                          {item.discountType === 'percent'
                            ? `${item.discount}%`
                            : formatCurrency(item.discount)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className={`${tablePaddingClass} text-right font-mono font-bold text-stone-900`}>
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}

                {/* Aesthetic Spacer rows for balance */}
                {quote.items.length < 4 &&
                  Array.from({ length: 4 - quote.items.length }).map((_, emptyIdx) => (
                    <tr key={`empty-${emptyIdx}`} className="h-7 opacity-20">
                      <td className="text-center">&nbsp;</td>
                      {showSku && <td>&nbsp;</td>}
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* ========================================================
              4. TOTALS & SUMMARY SECTION (Crisp, High Contrast, Readable)
              ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 mt-4 avoid-break">
            {/* Left Box: Thai Baht Text & Bank Account (Col 1-7) */}
            <div className="sm:col-span-7 space-y-2.5 flex flex-col justify-between">
              {/* Thai Baht text pill */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/90">
                <span className="text-[10px] text-stone-500 font-medium block uppercase tracking-wider">
                  จำนวนเงินรวมทั้งสิ้น (ตัวอักษร) / Thai Baht in Words:
                </span>
                <span className="text-xs sm:text-sm font-bold text-red-700 block mt-1">
                  ({quote.thaiBahtText})
                </span>
              </div>

              {/* Bank Accounts Info */}
              {settings.showBankAccounts && quote.bankAccounts && quote.bankAccounts.length > 0 && (
                <div className="p-3 rounded-xl bg-stone-50/60 border border-stone-200/80 text-[10.5px] space-y-1.5">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-red-600" />
                    <span>ข้อมูลบัญชีธนาคารสำหรับโอนชำระเงิน:</span>
                  </div>
                  <div className="space-y-1.5 pl-0.5">
                    {quote.bankAccounts.slice(0, 2).map((bank) => (
                      <div
                        key={bank.id}
                        className="flex items-center justify-between bg-white p-2 px-2.5 rounded-lg border border-stone-200/80"
                      >
                        <div>
                          <strong className="text-stone-900 font-semibold">{bank.bankName}</strong>
                          {bank.branch && <span className="text-stone-500"> ({bank.branch})</span>}
                          <span className="block text-[9.5px] text-stone-500">
                            ชื่อบัญชี: {bank.accountName}
                          </span>
                        </div>
                        <div className="font-mono font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200 text-xs">
                          {bank.accountNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {quote.notes && (
                <div className="text-[10px] text-stone-500 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-200/70">
                  <strong className="text-stone-700 font-semibold">หมายเหตุ:</strong> {quote.notes}
                </div>
              )}
            </div>

            {/* Right Box: Calculation Breakdown (Col 8-12) */}
            <div className="sm:col-span-5 bg-stone-50/80 p-3.5 rounded-xl border border-stone-200 text-[11.5px] space-y-2 font-medium">
              <div className="flex justify-between text-stone-600">
                <span>รวมเป็นเงิน (Subtotal):</span>
                <span className="font-mono font-semibold text-stone-900">
                  ฿{formatCurrency(quote.subtotal)}
                </span>
              </div>

              {quote.overallDiscountAmount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>
                    ส่วนลดพิเศษ{' '}
                    {settings.overallDiscountType === 'percent'
                      ? `(${settings.overallDiscount}%)`
                      : ''}
                    :
                  </span>
                  <span className="font-mono font-semibold">
                    -฿{formatCurrency(quote.overallDiscountAmount)}
                  </span>
                </div>
              )}

              {quote.overallDiscountAmount > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>ยอดหลังหักส่วนลด:</span>
                  <span className="font-mono font-medium text-stone-800">
                    ฿{formatCurrency(quote.netBeforeTax)}
                  </span>
                </div>
              )}

              {quote.shippingAmount > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>ค่าจัดส่ง (Shipping):</span>
                  <span className="font-mono font-medium text-stone-800">
                    ฿{formatCurrency(quote.shippingAmount)}
                  </span>
                </div>
              )}

              {settings.vatType !== 'none' && (
                <div className="flex justify-between text-stone-700">
                  <span>
                    ภาษีมูลค่าเพิ่ม (VAT {settings.vatRate}%){' '}
                    {settings.vatType === 'include' ? '(รวมในราคา)' : ''}:
                  </span>
                  <span className="font-mono font-semibold text-red-700">
                    ฿{formatCurrency(quote.vatAmount)}
                  </span>
                </div>
              )}

              {settings.withholdingTaxEnabled && quote.withholdingTaxAmount > 0 && (
                <div className="flex justify-between text-rose-700 text-[10.5px]">
                  <span>หักภาษี ณ ที่จ่าย ({settings.withholdingTaxRate}%):</span>
                  <span className="font-mono font-semibold">
                    -฿{formatCurrency(quote.withholdingTaxAmount)}
                  </span>
                </div>
              )}

              {/* Grand Total Box (Comfortable, High Contrast Highlight) */}
              <div className="pt-2.5 mt-2 border-t-2 border-red-600 bg-red-50/70 -mx-3.5 -mb-3.5 p-3.5 rounded-b-xl flex justify-between items-center text-red-900">
                <div>
                  <span className="text-xs sm:text-sm font-bold block leading-tight">จำนวนเงินรวมทั้งสิ้น</span>
                  <span className="text-[9.5px] text-red-700 font-medium uppercase tracking-wider block">
                    GRAND TOTAL (THB)
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-mono font-black text-red-700">
                  ฿{formatCurrency(quote.grandTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              5. TERMS & CONDITIONS
              ======================================================== */}
          {quote.terms && (
            <div className="mt-3.5 p-3 bg-stone-50/50 rounded-xl border border-stone-200/80 text-[9.5px] text-stone-600 leading-relaxed avoid-break">
              <strong className="text-stone-800 font-semibold block mb-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-red-600" />
                เงื่อนไขการเสนอราคา (Terms & Conditions):
              </strong>
              <div className="whitespace-pre-line font-light pl-4">{quote.terms}</div>
            </div>
          )}
        </div>

        {/* Bottom Section (Signatures & Document Footer) */}
        <div className="relative z-10">
          {/* ========================================================
              6. SIGNATURE BLOCK (Clean & Spacious)
              ======================================================== */}
          {settings.showSignatureArea && (
            <div className="mt-6 pt-4 border-t border-stone-200 grid grid-cols-3 gap-4 text-center text-[10.5px] avoid-break">
              {/* 1. Prepared By */}
              <div className="flex flex-col justify-end space-y-1">
                <div className="h-14 border-b border-stone-300 border-dashed flex items-end justify-center pb-1">
                  <span className="text-[10px] text-stone-600 font-medium">
                    {settings.salesperson || '(................................................)'}
                  </span>
                </div>
                <p className="font-bold text-stone-800">ผู้เสนอราคา / จัดทำโดย</p>
                <p className="text-[9.5px] text-stone-500 font-mono">วันที่ ....../....../......</p>
              </div>

              {/* 2. Authorized Signature & Stamp */}
              <div className="flex flex-col justify-end space-y-1 border-l border-r border-stone-200 px-2">
                <div className="h-14 border-b border-stone-300 border-dashed flex items-center justify-center">
                  <span className="text-[9.5px] text-stone-400 font-light italic">
                    [ ตราประทับ บจก. พงษ์สกุล ฮาร์ดแวร์ ]
                  </span>
                </div>
                <p className="font-bold text-red-700">ผู้มีอำนาจลงนาม</p>
                <p className="text-[9.5px] text-stone-600 font-medium">บจก. พงษ์สกุล ฮาร์ดแวร์</p>
              </div>

              {/* 3. Customer Acceptance */}
              <div className="flex flex-col justify-end space-y-1">
                <div className="h-14 border-b border-stone-300 border-dashed flex items-end justify-center pb-1">
                  <span className="text-[9.5px] text-stone-400 font-light">
                    (......................................................)
                  </span>
                </div>
                <p className="font-bold text-stone-800">ผู้อนุมัติสั่งซื้อ / ผู้รับเอกสาร</p>
                <p className="text-[9.5px] text-stone-500 font-mono">วันที่ ....../....../......</p>
              </div>
            </div>
          )}

          {/* Document Version & Print Audit Footer */}
          <div className="pt-3 mt-4 text-[9px] text-stone-400 font-mono flex items-center justify-between border-t border-stone-200/60">
            <span>
              เอกสาร: {quote.quoteNumber} (Rev. {String(quote.revision || 0).padStart(2, '0')})
              {quote.revisionNote ? ` - ${quote.revisionNote}` : ''}
            </span>
            <span>บจก. พงษ์สกุล ฮาร์ดแวร์ • ออกโดยระบบคลาวด์</span>
          </div>
        </div>

        {/* Topmost Watermark Layer (ลายน้ำอยู่เลเยอร์บนสุด พาดทับตารางและข้อมูล) */}
        {showWatermark && watermarkStyle !== 'none' && (
          <WatermarkOverlay
            style={watermarkStyle}
            opacity={watermarkOpacity}
            customLogoUrl={company.logoUrl}
            companyNameEn={company.nameEn || 'Pongsakul Hardware'}
          />
        )}
      </div>
    </div>
  );
};
