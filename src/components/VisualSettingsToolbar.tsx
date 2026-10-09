import React from 'react';
import { QuotationSettings, LogoStyle, WatermarkStyle } from '../types';
import { LayoutTemplate, Image, Check, Stamp } from 'lucide-react';

interface VisualSettingsToolbarProps {
  settings: QuotationSettings;
  onUpdateSettings: (field: keyof QuotationSettings, value: any) => void;
  className?: string;
}

export const VisualSettingsToolbar: React.FC<VisualSettingsToolbarProps> = ({
  settings,
  onUpdateSettings,
  className = '',
}) => {
  const currentTemplate = settings.templateStyle || 'clean-modern';
  const currentDensity = settings.tableDensity || 'comfortable';
  const currentFontSize = settings.fontSize || 'normal';
  const currentLogoStyle = settings.logoStyle || 'concrete-banner';
  const showSku = settings.showSkuColumn !== false;
  const showWatermark = settings.showWatermark !== false;
  const watermarkStyle = settings.watermarkStyle || 'logo-diagonal';

  return (
    <div className={`bg-white rounded-xl border border-stone-200 shadow-xs p-3 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        {/* Left: Template style & Logo style quick switchers */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Template */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium flex items-center gap-1 text-[11px]">
              <LayoutTemplate className="w-3.5 h-3.5 text-red-600" />
              <span>รูปแบบ:</span>
            </span>

            <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px]">
              <button
                type="button"
                onClick={() => onUpdateSettings('templateStyle', 'clean-modern')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentTemplate === 'clean-modern'
                    ? 'bg-white text-red-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🌟 คลีน โมเดิร์น (สบายตา)
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings('templateStyle', 'classic-red')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentTemplate === 'classic-red'
                    ? 'bg-white text-red-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🏢 คลาสสิก
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings('templateStyle', 'minimal-slate')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentTemplate === 'minimal-slate'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📄 มินิมอล
              </button>
            </div>
          </div>

          {/* Logo Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium flex items-center gap-1 text-[11px]">
              <Image className="w-3.5 h-3.5 text-red-600" />
              <span>โลโก้:</span>
            </span>

            <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px]">
              <button
                type="button"
                title="โลโก้ทางการ Pongsakul Hardware แบนเนอร์คมชัด"
                onClick={() => onUpdateSettings('logoStyle', 'concrete-banner')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  currentLogoStyle === 'concrete-banner'
                    ? 'bg-white text-red-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🔴 แบนเนอร์ทางการ
              </button>
              <button
                type="button"
                title="ไอคอนสัญลักษณ์ PONGSAKUL"
                onClick={() => onUpdateSettings('logoStyle', 'concrete-icon')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  currentLogoStyle === 'concrete-icon'
                    ? 'bg-white text-red-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ไอคอนสัญลักษณ์
              </button>
              <button
                type="button"
                title="ฮาร์ดแวร์ Hexagon"
                onClick={() => onUpdateSettings('logoStyle', 'hardware-hex')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  currentLogoStyle === 'hardware-hex'
                    ? 'bg-white text-red-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ฮาร์ดแวร์
              </button>
            </div>
          </div>

          {/* Watermark Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium flex items-center gap-1 text-[11px]">
              <Stamp className="w-3.5 h-3.5 text-red-600" />
              <span>ลายน้ำ:</span>
            </span>

            <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px]">
              <button
                type="button"
                title="ลายน้ำโลโก้พงษ์สกุล พาดเฉียงกลางเอกสาร A4 (แนะนำ)"
                onClick={() => {
                  onUpdateSettings('showWatermark', true);
                  onUpdateSettings('watermarkStyle', 'logo-diagonal');
                }}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  showWatermark && watermarkStyle === 'logo-diagonal'
                    ? 'bg-white text-red-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🛡️ โลโก้พาดเฉียง
              </button>
              <button
                type="button"
                title="ลายน้ำสัญลักษณ์ตราพงษ์สกุล"
                onClick={() => {
                  onUpdateSettings('showWatermark', true);
                  onUpdateSettings('watermarkStyle', 'emblem-diagonal');
                }}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  showWatermark && watermarkStyle === 'emblem-diagonal'
                    ? 'bg-white text-red-700 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🏛️ ตราสัญลักษณ์
              </button>
              <button
                type="button"
                title="ปิดการแสดงลายน้ำ"
                onClick={() => onUpdateSettings('showWatermark', !showWatermark)}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  !showWatermark
                    ? 'bg-stone-300 text-stone-900 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {showWatermark ? 'เปิดอยู่' : 'ปิดลายน้ำ'}
              </button>
            </div>

            {showWatermark && (
              <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px]">
                <button
                  type="button"
                  title="ระดับจางนุ่มนวล 5% (แนะนำ - อ่านง่ายสบายตา)"
                  onClick={() => onUpdateSettings('watermarkOpacity', 0.05)}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    (settings.watermarkOpacity ?? 0.05) <= 0.05
                      ? 'bg-white text-red-700 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  จางนุ่มนวล (5%)
                </button>
                <button
                  type="button"
                  title="ระดับปานกลาง 8%"
                  onClick={() => onUpdateSettings('watermarkOpacity', 0.08)}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    (settings.watermarkOpacity ?? 0.05) > 0.05
                      ? 'bg-white text-red-700 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  เข้มขึ้น (8%)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Spacing, Font Size & Column controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Density */}
          <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px]">
            <button
              type="button"
              title="ตารางโปร่ง อ่านง่าย สบายตา"
              onClick={() => onUpdateSettings('tableDensity', 'comfortable')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentDensity === 'comfortable'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              โปร่ง สบายตา
            </button>
            <button
              type="button"
              title="ตารางกะทัดรัด บรรจุรายการได้เยอะ"
              onClick={() => onUpdateSettings('tableDensity', 'compact')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentDensity === 'compact'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              กะทัดรัด
            </button>
          </div>

          {/* Font Size */}
          <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px]">
            <button
              type="button"
              onClick={() => onUpdateSettings('fontSize', 'normal')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                currentFontSize === 'normal'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              อักษรปกติ
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings('fontSize', 'large')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                currentFontSize === 'large'
                  ? 'bg-white text-red-700 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ตัวใหญ่ ชัดเจน
            </button>
          </div>

          {/* SKU Column Toggle */}
          <button
            type="button"
            onClick={() => onUpdateSettings('showSkuColumn', !showSku)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all flex items-center gap-1 ${
              showSku
                ? 'bg-red-50/80 border-red-200 text-red-700 font-medium'
                : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
          >
            {showSku && <Check className="w-3 h-3 text-red-600" />}
            <span>รหัสสินค้า</span>
          </button>
        </div>
      </div>
    </div>
  );
};
