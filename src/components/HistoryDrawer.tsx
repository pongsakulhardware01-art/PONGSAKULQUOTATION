import React, { useState, useMemo } from 'react';
import { QuotationDocument, QuotationStatus } from '../types';
import { formatCurrency, formatThaiDate } from '../utils/formatters';
import {
  X,
  Search,
  History,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Upload,
  Clock,
  FileCheck,
  Building,
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuotes: QuotationDocument[];
  activeQuoteId: string;
  onLoadQuote: (quote: QuotationDocument) => void;
  onDuplicateQuote: (quote: QuotationDocument) => void;
  onDeleteQuote: (id: string) => void;
  onExportAll: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPullItemsToActive?: (quote: QuotationDocument) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedQuotes,
  activeQuoteId,
  onLoadQuote,
  onDuplicateQuote,
  onDeleteQuote,
  onExportAll,
  onImportFile,
  onPullItemsToActive,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuotes = useMemo(() => {
    return savedQuotes.filter((q) => {
      const matchStatus = statusFilter === 'all' || q.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !term ||
        q.quoteNumber.toLowerCase().includes(term) ||
        (q.customer.companyName && q.customer.companyName.toLowerCase().includes(term)) ||
        (q.customer.name && q.customer.name.toLowerCase().includes(term)) ||
        (q.referenceNo && q.referenceNo.toLowerCase().includes(term));
      return matchStatus && matchSearch;
    });
  }, [savedQuotes, searchTerm, statusFilter]);

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">
            อนุมัติแล้ว
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800">
            รออนุมัติ
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-800">
            ไม่อนุมัติ
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-stone-200 text-stone-700">
            หมดอายุ
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-stone-100 text-stone-600">
            ฉบับร่าง
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">ประวัติใบเสนอราคา</h2>
              <p className="text-xs text-stone-400">
                เอกสารที่บันทึกไว้ทั้งหมด ({savedQuotes.length} ฉบับ)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาเลขที่ใบเสนอราคา หรือชื่อลูกค้า..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-red-500 outline-hidden"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="draft">ฉบับร่าง (Draft)</option>
              <option value="pending">รออนุมัติ (Pending)</option>
              <option value="approved">อนุมัติแล้ว (Approved)</option>
              <option value="rejected">ไม่อนุมัติ (Rejected)</option>
              <option value="expired">หมดอายุ (Expired)</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={onExportAll}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 px-2.5 py-1.5 rounded-lg transition-colors"
                title="สำรองข้อมูลทั้งหมดเป็นไฟล์ JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>สำรองข้อมูล</span>
              </button>

              <label className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>นำเข้า</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Quotes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredQuotes.length === 0 ? (
            <div className="py-16 text-center text-stone-500">
              <Clock className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-medium">ยังไม่มีใบเสนอราคาในประวัติ</p>
              <p className="text-xs text-stone-400 mt-1">
                คลิกปุ่ม &quot;บันทึก&quot; ที่เมนูด้านบนเพื่อเก็บเอกสาร
              </p>
            </div>
          ) : (
            filteredQuotes.map((q) => {
              const isActive = q.id === activeQuoteId;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'border-red-500 bg-red-50/40 ring-2 ring-red-100'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-sm text-stone-900">
                          {q.quoteNumber}
                        </span>
                        {getStatusBadge(q.status)}
                      </div>
                      <div className="text-xs font-semibold text-stone-800 mt-0.5">
                        {q.customer.companyName || q.customer.name || 'ไม่ได้ระบุชื่อลูกค้า'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-red-700">
                        ฿{formatCurrency(q.grandTotal)}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {q.items.length} รายการ
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100 pt-2 mt-2">
                    <div>
                      วันที่: {formatThaiDate(q.issueDate, 'short')}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {onPullItemsToActive && q.items.length > 0 && (
                        <button
                          onClick={() => {
                            onPullItemsToActive(q);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                          title="ดึงรายการและราคาเดิมใส่ในใบที่กำลังเปิดอยู่"
                        >
                          <span>ดึงรายการ</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onLoadQuote(q);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>เปิด</span>
                      </button>
                      <button
                        onClick={() => onDuplicateQuote(q)}
                        className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-md"
                        title="คัดลอกเป็นฉบับใหม่"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteQuote(q.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                        title="ลบเอกสารนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl text-xs transition-colors"
          >
            ปิดหน้าต่างประวัติ
          </button>
        </div>
      </div>
    </div>
  );
};
