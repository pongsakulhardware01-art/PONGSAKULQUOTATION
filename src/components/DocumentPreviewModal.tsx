import React, { useState } from 'react';
import {
  X,
  Printer,
  FileImage,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Check,
  RotateCcw
} from 'lucide-react';
import { QuotationDocument, QuotationSettings } from '../types';
import { QuotationPreview } from './QuotationPreview';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuotationDocument;
  onPrint: () => void;
  onExportJpg: () => void;
  isExportingJpg?: boolean;
  onUpdateSettings?: (newSettings: Partial<QuotationSettings>) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  quote,
  onPrint,
  onExportJpg,
  isExportingJpg,
  onUpdateSettings,
}) => {
  const getInitialZoom = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return Math.round(Math.min(0.85, Math.max(0.42, (window.innerWidth - 24) / 794)) * 100) / 100;
    }
    return 0.92;
  };

  const [zoomLevel, setZoomLevel] = useState<number>(getInitialZoom);
  const [showSettings, setShowSettings] = useState(false);

  if (!isOpen) return null;

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => {
      const next = Math.round((prev + delta) * 100) / 100;
      return Math.min(Math.max(next, 0.35), 1.3);
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(getInitialZoom());
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-xs flex flex-col items-center animate-in fade-in"
      onClick={onClose}
    >
      {/* Top Floating Control Bar */}
      <header
        className="sticky top-0 z-20 w-full bg-stone-900/95 border-b border-stone-800 text-white px-3 sm:px-4 py-2.5 sm:py-3 shadow-xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          {/* Top Line on Mobile: Title + Quote No + Close Button */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                    ตัวอย่างเอกสาร A4
                  </h3>
                  <span className="font-mono text-[10px] sm:text-xs font-semibold px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 border border-stone-700">
                    {quote.quoteNumber || 'ฉบับร่าง'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-stone-400 truncate max-w-[200px] sm:max-w-xs">
                  {quote.customer.companyName || quote.customer.name || 'ลูกค้าทั่วไป'}
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition cursor-pointer"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Row on Mobile / Centered on Desktop */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto flex-wrap">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-800/80 rounded-lg p-0.5 sm:p-1 border border-stone-700 text-xs">
              <button
                onClick={() => handleZoom(-0.1)}
                className="p-1 sm:p-1.5 text-stone-300 hover:text-white hover:bg-stone-700 rounded transition cursor-pointer"
                title="ย่อมุมมอง"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-1.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold text-stone-200 hover:text-white cursor-pointer"
                title="พอดีหน้าจอ"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => handleZoom(0.1)}
                className="p-1 sm:p-1.5 text-stone-300 hover:text-white hover:bg-stone-700 rounded transition cursor-pointer"
                title="ขยายมุมมอง"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {onUpdateSettings && (
                <>
                  <div className="w-px h-3.5 bg-stone-700 mx-0.5" />
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-1 sm:px-2 sm:py-1 rounded text-xs transition cursor-pointer flex items-center gap-1 ${
                      showSettings ? 'bg-red-600 text-white' : 'text-stone-300 hover:bg-stone-700'
                    }`}
                    title="ปรับแต่งสีและรูปแบบเอกสาร"
                  >
                    <Sliders className="w-3 h-3" />
                    <span className="hidden md:inline">ปรับแต่ง</span>
                  </button>
                </>
              )}
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onExportJpg}
                disabled={isExportingJpg}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
                title="สร้างและบันทึกเป็นรูปภาพ JPG ส่ง LINE"
              >
                <FileImage className="w-3.5 h-3.5 text-stone-950 shrink-0" />
                <span className="hidden sm:inline">{isExportingJpg ? 'กำลังสร้าง...' : 'ส่งออก JPG'}</span>
                <span className="sm:hidden text-[11px]">JPG</span>
              </button>

              <button
                onClick={onPrint}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow-xs transition cursor-pointer"
                title="พิมพ์เอกสารออกเครื่องพิมพ์ หรือบันทึกเป็น PDF"
              >
                <Printer className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">พิมพ์ / PDF</span>
                <span className="sm:hidden text-[11px]">พิมพ์</span>
              </button>

              <button
                onClick={onClose}
                className="hidden sm:inline-flex p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition cursor-pointer ml-0.5"
                title="ปิดหน้าต่าง (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown / Accordion for Quick Visual Settings */}
        {showSettings && onUpdateSettings && (
          <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-stone-400 font-medium">สีแถบเอกสาร:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: 'แดงพงษ์สกุล', color: '#b91c1c' },
                  { name: 'ส้มอิฐ', color: '#c2410c' },
                  { name: 'น้ำเงินเข้ม', color: '#1e3a8a' },
                  { name: 'เทาเข้ม', color: '#374151' },
                ].map((item) => (
                  <button
                    key={item.color}
                    onClick={() => onUpdateSettings({ primaryColor: item.color })}
                    className={`w-6 h-6 rounded-full border-2 transition cursor-pointer flex items-center justify-center ${
                      quote.settings.primaryColor === item.color
                        ? 'border-white scale-110'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  >
                    {quote.settings.primaryColor === item.color && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-1.5 cursor-pointer text-stone-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={quote.settings.showBankDetails}
                  onChange={(e) => onUpdateSettings({ showBankDetails: e.target.checked })}
                  className="rounded border-stone-700 text-red-600 focus:ring-red-500"
                />
                <span>แสดงข้อมูลธนาคาร</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-stone-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={quote.settings.showDiscountColumn}
                  onChange={(e) => onUpdateSettings({ showDiscountColumn: e.target.checked })}
                  className="rounded border-stone-700 text-red-600 focus:ring-red-500"
                />
                <span>แสดงคอลัมน์ส่วนลด</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-stone-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={quote.settings.showSignatures}
                  onChange={(e) => onUpdateSettings({ showSignatures: e.target.checked })}
                  className="rounded border-stone-700 text-red-600 focus:ring-red-500"
                />
                <span>แสดงช่องลงนาม</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-amber-300 hover:text-amber-200 font-medium">
                <input
                  type="checkbox"
                  checked={quote.settings.showWatermark !== false}
                  onChange={(e) => onUpdateSettings({ showWatermark: e.target.checked })}
                  className="rounded border-stone-700 text-red-600 focus:ring-red-500"
                />
                <span>ลายน้ำโลโก้พาด (Watermark)</span>
              </label>

              {quote.settings.showWatermark !== false && (
                <>
                  <div className="flex items-center gap-1.5 bg-stone-800/80 px-2 py-0.5 rounded-lg border border-stone-700">
                    <span className="text-stone-400 text-[11px]">แบบ:</span>
                    <select
                      value={quote.settings.watermarkStyle || 'logo-diagonal'}
                      onChange={(e) => onUpdateSettings({ watermarkStyle: e.target.value as any })}
                      className="bg-transparent text-stone-200 text-xs outline-none cursor-pointer"
                    >
                      <option value="logo-diagonal" className="bg-stone-900 text-white">🛡️ โลโก้พาดเฉียง</option>
                      <option value="emblem-diagonal" className="bg-stone-900 text-white">🏛️ ตราสัญลักษณ์</option>
                      <option value="logo-center" className="bg-stone-900 text-white">➖ โลโก้กึ่งกลาง</option>
                      <option value="text-diagonal" className="bg-stone-900 text-white">📜 ข้อความริบบิ้น</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-stone-800/80 px-2 py-0.5 rounded-lg border border-stone-700">
                    <span className="text-stone-400 text-[11px]">ความเข้ม:</span>
                    <select
                      value={quote.settings.watermarkOpacity ?? 0.05}
                      onChange={(e) => onUpdateSettings({ watermarkOpacity: parseFloat(e.target.value) })}
                      className="bg-transparent text-stone-200 text-xs outline-none cursor-pointer"
                    >
                      <option value="0.035" className="bg-stone-900 text-white">จางมาก (3.5%)</option>
                      <option value="0.05" className="bg-stone-900 text-white">จางนุ่มนวล (5% แนะนำ)</option>
                      <option value="0.08" className="bg-stone-900 text-white">ปานกลาง (8%)</option>
                      <option value="0.12" className="bg-stone-900 text-white">ชัดเจน (12%)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Preview Workspace */}
      <div
        className="w-full flex-1 p-4 sm:p-8 flex justify-center items-start overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="transition-transform duration-150 origin-top shadow-2xl rounded-sm my-4 bg-white"
          style={{
            transform: `scale(${zoomLevel})`,
          }}
        >
          <QuotationPreview quote={quote} />
        </div>
      </div>
    </div>
  );
};
