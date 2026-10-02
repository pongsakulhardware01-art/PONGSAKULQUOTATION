import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  X,
  FileImage,
  Sparkles,
  Maximize2,
  ExternalLink,
  Loader2,
  Info,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { QuotationDocument } from '../types';
import { sanitizeFilename } from '../utils/exportImage';

interface ExportJpgModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuotationDocument;
  dataUrl: string | null;
  isGenerating: boolean;
  onRegenerate: (resolution: 'standard' | 'high' | 'ultra') => Promise<void>;
  onDownload: () => void;
  onCopyClipboard: () => Promise<boolean>;
}

export const ExportJpgModal: React.FC<ExportJpgModalProps> = ({
  isOpen,
  onClose,
  quote,
  dataUrl,
  isGenerating,
  onRegenerate,
  onDownload,
  onCopyClipboard,
}) => {
  const [resolution, setResolution] = useState<'standard' | 'high' | 'ultra'>('high');
  const [copied, setCopied] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  if (!isOpen) return null;

  const rawClient = (quote.customer.companyName || quote.customer.name || '').trim();
  const clientName = rawClient && !rawClient.includes('สมชาย') ? rawClient : 'ลูกค้า';
  const filename = sanitizeFilename(`ใบเสนอราคา_${quote.quoteNumber}_${clientName}.jpg`);

  const handleResolutionChange = async (newRes: 'standard' | 'high' | 'ultra') => {
    setResolution(newRes);
    await onRegenerate(newRes);
  };

  const handleCopy = async () => {
    setCopyLoading(true);
    try {
      const ok = await onCopyClipboard();
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCopyLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <FileImage className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight flex items-center gap-2">
                <span>บันทึกใบเสนอราคาเป็นภาพ JPG</span>
                <span className="text-[10px] bg-red-600 text-white font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
                  พร้อมส่ง LINE
                </span>
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                {filename}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-stone-100/50">
          {/* Left: Image Preview Container (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-stone-600 mb-2 px-1">
              <span className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ตัวอย่างภาพที่จะบันทึก (ภาพจริง)
              </span>
              {dataUrl && (
                <button
                  type="button"
                  onClick={() => setFullscreenPreview(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-medium"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>ดูภาพขนาดใหญ่</span>
                </button>
              )}
            </div>

            <div className="relative w-full bg-stone-200/80 rounded-xl p-3 sm:p-4 flex items-center justify-center min-h-[380px] sm:min-h-[460px] border border-stone-300 shadow-inner overflow-hidden">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center gap-3 text-stone-600">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                  <span className="text-sm font-medium">กำลังเรนเดอร์ภาพความคมชัดสูง...</span>
                  <span className="text-xs text-stone-400">กรุณารอสักครู่</span>
                </div>
              ) : dataUrl ? (
                <div className="relative group cursor-pointer" onClick={() => setFullscreenPreview(true)}>
                  <img
                    src={dataUrl}
                    alt="ตัวอย่างใบเสนอราคา JPG"
                    className="max-h-[420px] sm:max-h-[500px] w-auto rounded shadow-md object-contain bg-white transition-transform group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                    <span className="bg-white/90 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" />
                      คลิกเพื่อขยาย
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-stone-400 text-sm">ไม่พบรูปภาพตัวอย่าง</div>
              )}
            </div>
          </div>

          {/* Right: Actions & Options (Col 8-12) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Action Buttons */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                ส่งออก / คัดลอกภาพ
              </h3>

              {/* Main Download Button */}
              <button
                type="button"
                onClick={onDownload}
                disabled={isGenerating || !dataUrl}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดรูปภาพ .JPG ทันที</span>
              </button>

              {/* Copy Image Button */}
              <button
                type="button"
                onClick={handleCopy}
                disabled={isGenerating || !dataUrl || copyLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 font-semibold rounded-xl border border-stone-300 transition-colors disabled:opacity-50 text-xs sm:text-sm"
              >
                {copyLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                ) : copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-red-600" />
                )}
                <span>
                  {copied ? 'คัดลอกรูปภาพแล้ว! (กด Ctrl+V ใน LINE ได้เลย)' : 'คัดลอกรูปภาพ (Copy to Clipboard)'}
                </span>
              </button>
            </div>

            {/* Quality & Resolution Selection */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2.5">
              <label className="text-xs font-bold text-stone-700 block">
                เลือกระดับความละเอียดภาพ (Resolution)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleResolutionChange('standard')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    resolution === 'standard'
                      ? 'border-red-600 bg-red-50/50 text-red-900 font-semibold ring-1 ring-red-600'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs block font-bold">1x ทั่วไป</span>
                  <span className="text-[10px] text-stone-500 block">ไฟล์เล็ก ~150KB</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolutionChange('high')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    resolution === 'high'
                      ? 'border-red-600 bg-red-50/50 text-red-900 font-semibold ring-1 ring-red-600'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs block font-bold text-red-700 flex items-center gap-1">
                    2x คมชัดสูง
                  </span>
                  <span className="text-[10px] text-stone-500 block">แนะนำสำหรับ LINE</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolutionChange('ultra')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    resolution === 'ultra'
                      ? 'border-red-600 bg-red-50/50 text-red-900 font-semibold ring-1 ring-red-600'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs block font-bold">3x คมชัดพิเศษ</span>
                  <span className="text-[10px] text-stone-500 block">ความละเอียดสูงมาก</span>
                </button>
              </div>
            </div>

            {/* Practical Advice Box */}
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>คำแนะนำการส่งให้ลูกค้า:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11.5px] text-amber-800 leading-relaxed font-normal">
                <li>
                  <strong>ส่งทาง LINE ในคอม:</strong> กดปุ่ม <em>"คัดลอกรูปภาพ"</em> แล้วไปที่แชต LINE กด <code>Ctrl + V</code> เพื่อส่งได้ทันที ไม่ต้องค้นหาไฟล์ในเครื่อง
                </li>
                <li>
                  <strong>ส่งทางมือถือ:</strong> กดดาวน์โหลด JPG แล้วส่งรูปภาพเข้าแชต LINE หรือ Facebook ได้ภาพคมชัด รายละเอียดตัวเลขและชื่อบริษัทชัดเจน
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 bg-white flex items-center justify-between text-xs text-stone-500">
          <span className="font-mono text-stone-600 truncate max-w-[280px]">
            {quote.quoteNumber} | ยอดรวม ฿{quote.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 font-semibold rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>

      {/* Fullscreen Preview Lightbox */}
      {fullscreenPreview && dataUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex flex-col items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setFullscreenPreview(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={dataUrl}
              alt="ใบเสนอราคาขนาดเต็ม"
              className="max-h-[85vh] w-auto mx-auto rounded shadow-2xl bg-white"
            />
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดรูปนี้</span>
              </button>
              <button
                type="button"
                onClick={() => setFullscreenPreview(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-lg shadow text-xs"
              >
                ปิดภาพขยาย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
