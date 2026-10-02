import React from 'react';
import {
  FilePlus,
  Save,
  Printer,
  History,
  Settings,
  Boxes,
  Eye,
  Edit3,
  Columns3,
  Sparkles,
  FileImage,
  Users,
  Cloud,
  CloudOff,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { LogoEmblem } from './LogoEmblem';

interface HeaderProps {
  viewMode: 'split' | 'edit' | 'preview';
  onViewModeChange: (mode: 'split' | 'edit' | 'preview') => void;
  onNewQuote: () => void;
  onSaveQuote: () => void;
  onPrint: () => void;
  onExportJpg: () => void;
  isExportingJpg?: boolean;
  onOpenHistory: () => void;
  onOpenCatalog: () => void;
  onOpenSettings: () => void;
  onOpenCustomers: () => void;
  customerCount: number;
  savedCount: number;
  isSaving?: boolean;
  quoteNumber: string;
  isCloudConnected?: boolean;
  currentUser?: { email?: string | null; displayName?: string | null } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onNewQuote,
  onSaveQuote,
  onPrint,
  onExportJpg,
  isExportingJpg,
  onOpenHistory,
  onOpenCatalog,
  onOpenSettings,
  onOpenCustomers,
  customerCount,
  savedCount,
  isSaving,
  quoteNumber,
  isCloudConnected = true,
  currentUser,
  onLogin,
  onLogout,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <LogoEmblem size="banner-sm" />
            <div className="hidden md:block h-6 w-px bg-stone-200" />
            <div className="hidden md:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  ระบบออกใบเสนอราคา
                </span>
                {isCloudConnected ? (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200"
                    title="เชื่อมต่อฐานข้อมูล Cloud Firestore เรียบร้อยแล้ว (Multi-user)"
                  >
                    <Cloud className="w-2.5 h-2.5 text-emerald-600" /> คลาวด์ซิงค์
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded-md border border-stone-200">
                    <CloudOff className="w-2.5 h-2.5" /> ออฟไลน์
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-stone-800 truncate max-w-[200px] font-mono">
                {quoteNumber || 'ฉบับใหม่'}
              </span>
            </div>
          </div>

          {/* View Mode Toggle (Desktop & Tablet) */}
          <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-medium">
            <button
              id="view-mode-split-btn"
              onClick={() => onViewModeChange('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-white text-red-700 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="แก้ไขและดูตัวอย่างคู่กัน"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>แบ่ง 2 ฝั่ง</span>
            </button>
            <button
              id="view-mode-edit-btn"
              onClick={() => onViewModeChange('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'edit'
                  ? 'bg-white text-red-700 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="แสดงเฉพาะหน้าจอแก้ไข"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>แก้ไข</span>
            </button>
            <button
              id="view-mode-preview-btn"
              onClick={() => onViewModeChange('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white text-red-700 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="แสดงเอกสาร A4 เต็มจอ"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>เอกสาร A4</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Customer Database button */}
            <button
              id="open-customers-btn"
              onClick={onOpenCustomers}
              className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-stone-800 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer"
              title="จัดการฐานข้อมูลลูกค้า (Customer Database)"
            >
              <Users className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">ฐานลูกค้า</span>
              {customerCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-stone-700 bg-stone-200 rounded-full">
                  {customerCount}
                </span>
              )}
            </button>

            {/* Catalog Picker */}
            <button
              id="open-catalog-btn"
              onClick={onOpenCatalog}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer"
              title="เลือกสินค้าสำเร็จรูปจากคลัง"
            >
              <Boxes className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">คลังสินค้า</span>
            </button>

            {/* New Quote */}
            <button
              id="new-quote-btn"
              onClick={onNewQuote}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer"
              title="สร้างใบเสนอราคาใหม่ (รันเลขที่อัตโนมัติ)"
            >
              <FilePlus className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">สร้างใหม่</span>
            </button>

            {/* History with badge */}
            <button
              id="open-history-btn"
              onClick={onOpenHistory}
              className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer"
              title="ประวัติใบเสนอราคาคลาวด์ทั้งหมด"
            >
              <History className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">ประวัติ</span>
              {savedCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Save Button */}
            <button
              id="save-quote-btn"
              onClick={onSaveQuote}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
              title="บันทึกใบเสนอราคานี้ขึ้น Cloud"
            >
              <Save className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">{isSaving ? 'กำลังบันทึก...' : 'บันทึก'}</span>
            </button>

            {/* Export JPG Button */}
            <button
              id="export-jpg-btn"
              onClick={onExportJpg}
              disabled={isExportingJpg}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-800 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 rounded-lg border border-amber-300 shadow-2xs hover:shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              title="บันทึกใบเสนอราคาเป็นภาพ JPG ส่ง LINE ได้ทันที"
            >
              <FileImage className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">{isExportingJpg ? 'กำลังทำ JPG...' : 'บันทึกเป็น JPG'}</span>
              <span className="sm:hidden font-bold text-amber-800">.JPG</span>
            </button>

            {/* Print / Export PDF Primary Button */}
            <button
              id="print-pdf-btn"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
              title="พิมพ์เอกสาร หรือ บันทึกเป็น PDF ทันที"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ / PDF</span>
            </button>

            {/* Multi-user auth & Settings */}
            {currentUser ? (
              <div className="flex items-center gap-1 pl-1 border-l border-stone-200">
                <span
                  className="hidden xl:inline-block text-xs text-stone-600 truncate max-w-[120px]"
                  title={currentUser.email || ''}
                >
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="p-2 text-stone-500 hover:text-red-600 hover:bg-stone-100 rounded-lg transition"
                  title={`ออกจากระบบ (${currentUser.email})`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : onLogin ? (
              <button
                onClick={onLogin}
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition"
                title="เข้าสู่ระบบ Google เพื่อระบุตัวตนผู้สร้างเอกสาร"
              >
                <LogIn className="w-3.5 h-3.5 text-stone-500" />
                <span>เข้าสู่ระบบ</span>
              </button>
            ) : null}

            {/* Settings */}
            <button
              id="open-settings-btn"
              onClick={onOpenSettings}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-transparent hover:border-stone-200 transition-colors cursor-pointer"
              title="ตั้งค่าข้อมูลบริษัทและบัญชีธนาคาร"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex lg:hidden items-center justify-center py-2 border-t border-stone-100 gap-2 text-xs font-medium">
          <button
            onClick={() => onViewModeChange('edit')}
            className={`flex-1 py-1.5 text-center rounded-md ${
              viewMode === 'edit'
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            แบบฟอร์มแก้ไข
          </button>
          <button
            onClick={() => onViewModeChange('preview')}
            className={`flex-1 py-1.5 text-center rounded-md ${
              viewMode === 'preview'
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            ดูตัวอย่าง A4
          </button>
        </div>
      </div>
    </header>
  );
};
