import React from 'react';
import { X, Sparkles, Calendar, Tag, CheckCircle2, ShieldCheck } from 'lucide-react';
import { APP_VERSION, APP_BUILD_DATE, VERSION_HISTORY } from '../version';

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionModal: React.FC<VersionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">ข้อมูลเวอร์ชันโปรแกรม</h3>
                <span className="font-mono text-xs font-bold bg-white text-red-700 px-2 py-0.5 rounded-full shadow-xs">
                  v{APP_VERSION}
                </span>
              </div>
              <p className="text-xs text-red-100 mt-0.5">
                ระบบออกใบเสนอราคา • บริษัท พงษ์สกุล ฮาร์ดแวร์ จำกัด
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Current Version Badge Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                เวอร์ชันปัจจุบันที่ติดตั้ง
              </div>
              <div className="text-lg font-extrabold text-stone-900 font-mono flex items-center gap-2 mt-0.5">
                <span>Version {APP_VERSION}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> ล่าสุด
                </span>
              </div>
            </div>
            <div className="text-xs text-stone-500 flex items-center gap-1.5 sm:text-right">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>ปรับปรุงล่าสุด: {APP_BUILD_DATE}</span>
            </div>
          </div>

          {/* Changelog Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              ประวัติการปรับปรุงเวอร์ชัน (Changelog)
            </h4>

            <div className="space-y-4">
              {VERSION_HISTORY.map((rel, idx) => (
                <div
                  key={rel.version}
                  className={`rounded-xl p-4 border transition-all ${
                    idx === 0
                      ? 'bg-red-50/40 border-red-200 shadow-2xs'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-stone-900 text-white px-2 py-0.5 rounded-md">
                        v{rel.version}
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] font-bold text-red-700 uppercase bg-red-100 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-500 font-mono">{rel.date}</span>
                  </div>

                  <p className="text-xs font-semibold text-stone-800 mb-2">{rel.title}</p>

                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {rel.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>ระบบจะปรับเวอร์ชันอัตโนมัติทุกครั้งที่มีการแก้ไข</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-lg transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
