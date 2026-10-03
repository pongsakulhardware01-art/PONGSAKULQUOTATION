import React, { useState } from 'react';
import {
  FilePlus,
  Save,
  Printer,
  History,
  Settings,
  Boxes,
  Eye,
  FileImage,
  Users,
  Cloud,
  CloudOff,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { LogoEmblem } from './LogoEmblem';
import { APP_VERSION } from '../version';

interface HeaderProps {
  viewMode?: 'split' | 'edit' | 'preview';
  onViewModeChange?: (mode: 'split' | 'edit' | 'preview') => void;
  onNewQuote: () => void;
  onSaveQuote: () => void;
  onPrint: () => void;
  onExportJpg: () => void;
  onOpenPreview?: () => void;
  isExportingJpg?: boolean;
  onOpenHistory: () => void;
  onOpenCatalog: () => void;
  onOpenSettings: () => void;
  onOpenCustomers: () => void;
  onOpenVersion?: () => void;
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
  onNewQuote,
  onSaveQuote,
  onPrint,
  onExportJpg,
  onOpenPreview,
  isExportingJpg,
  onOpenHistory,
  onOpenCatalog,
  onOpenSettings,
  onOpenCustomers,
  onOpenVersion,
  customerCount,
  savedCount,
  isSaving,
  quoteNumber,
  isCloudConnected = true,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <LogoEmblem size="banner-sm" />
            
            <div className="hidden sm:block h-6 w-px bg-stone-200 shrink-0" />
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="hidden md:inline text-xs font-semibold uppercase tracking-wider text-stone-500">
                  ระบบออกใบเสนอราคา
                </span>
                <button
                  type="button"
                  onClick={onOpenVersion}
                  className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-1.5 py-0.2 rounded transition cursor-pointer shrink-0"
                  title="คลิกเพื่อดูรายละเอียดเวอร์ชันและประวัติการอัปเดต"
                >
                  v{APP_VERSION}
                </button>
                {isCloudConnected ? (
                  <span
                    className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0"
                    title="เชื่อมต่อฐานข้อมูล Cloud Firestore เรียบร้อยแล้ว"
                  >
                    <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                    <span className="hidden sm:inline">คลาวด์</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200 shrink-0">
                    <CloudOff className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">ออฟไลน์</span>
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold text-stone-800 truncate font-mono">
                {quoteNumber || 'ฉบับใหม่'}
              </span>
            </div>
          </div>

          {/* Desktop Action Buttons (md & up) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {/* Customer Database button */}
            <button
              id="open-customers-btn"
              onClick={onOpenCustomers}
              className="relative inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-stone-800 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer shrink-0"
              title="จัดการฐานข้อมูลลูกค้า (Customer Database)"
            >
              <Users className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden lg:inline">ฐานลูกค้า</span>
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer shrink-0"
              title="เลือกสินค้าสำเร็จรูปจากคลัง"
            >
              <Boxes className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden lg:inline">คลังสินค้า</span>
            </button>

            {/* History with badge */}
            <button
              id="open-history-btn"
              onClick={onOpenHistory}
              className="relative inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors cursor-pointer shrink-0"
              title="ประวัติใบเสนอราคาคลาวด์ทั้งหมด"
            >
              <History className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden lg:inline">ประวัติ</span>
              {savedCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <div className="h-5 w-px bg-stone-200 mx-0.5" />

            {/* View / Preview A4 Button (Modal) */}
            {onOpenPreview && (
              <button
                id="open-preview-btn"
                onClick={onOpenPreview}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-900 active:bg-black rounded-lg shadow-2xs transition cursor-pointer shrink-0"
                title="เปิดดูตัวอย่างเอกสาร A4 เต็มตา (Preview)"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span>ดูตัวอย่าง (A4)</span>
              </button>
            )}

            {/* Export JPG Button */}
            <button
              id="export-jpg-btn"
              onClick={onExportJpg}
              disabled={isExportingJpg}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-900 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-lg shadow-2xs transition disabled:opacity-50 cursor-pointer shrink-0"
              title="บันทึกใบเสนอราคาเป็นภาพ JPG ส่ง LINE ได้ทันที"
            >
              <FileImage className="w-3.5 h-3.5 text-stone-950" />
              <span>{isExportingJpg ? 'กำลังสร้าง...' : 'ส่งออก JPG'}</span>
            </button>

            {/* Print / Export PDF Primary Button */}
            <button
              id="print-pdf-btn"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-2xs transition cursor-pointer shrink-0"
              title="พิมพ์เอกสาร หรือ บันทึกเป็น PDF ทันที"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ / PDF</span>
            </button>

            <div className="h-5 w-px bg-stone-200 mx-0.5" />

            {/* Save Button */}
            <button
              id="save-quote-btn"
              onClick={onSaveQuote}
              disabled={isSaving}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition disabled:opacity-50 cursor-pointer shrink-0"
              title="บันทึกใบเสนอราคานี้ขึ้น Cloud"
            >
              <Save className="w-3.5 h-3.5 text-stone-600" />
              <span>{isSaving ? 'บันทึก...' : 'บันทึก'}</span>
            </button>

            {/* New Quote */}
            <button
              id="new-quote-btn"
              onClick={onNewQuote}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-300 transition cursor-pointer shrink-0"
              title="สร้างใบเสนอราคาใหม่ (รันเลขที่อัตโนมัติ)"
            >
              <FilePlus className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-transparent hover:border-stone-200 transition cursor-pointer shrink-0"
              title="ตั้งค่าข้อมูลบริษัทและบัญชีธนาคาร"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Controls (< md) */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {/* Quick Preview on Mobile */}
            {onOpenPreview && (
              <button
                onClick={onOpenPreview}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                title="ดูตัวอย่าง A4"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px]">พรีวิว</span>
              </button>
            )}

            {/* Quick Save on Mobile */}
            <button
              onClick={onSaveQuote}
              disabled={isSaving}
              className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-300 transition cursor-pointer"
              title="บันทึก"
            >
              <Save className="w-4 h-4 text-stone-700" />
            </button>

            {/* Hamburger Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg border border-stone-300 transition cursor-pointer"
              aria-label="เมนูคำสั่ง"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-red-600" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {/* Output Action Grid */}
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-stone-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onExportJpg();
                }}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-500 active:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs shadow-xs"
              >
                <FileImage className="w-4 h-4" />
                <span>ส่งออก JPG (ส่ง LINE)</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onPrint();
                }}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl text-xs shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์ / PDF</span>
              </button>
            </div>

            {/* Navigation & Data Links */}
            <div className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCustomers();
                }}
                className="w-full flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl text-stone-800 font-medium"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-600" />
                  <span>ฐานข้อมูลลูกค้า</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono text-[11px]">
                  {customerCount} ราย
                </span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCatalog();
                }}
                className="w-full flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl text-stone-800 font-medium"
              >
                <span className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-red-600" />
                  <span>คลังสินค้าฮาร์ดแวร์</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenHistory();
                }}
                className="w-full flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl text-stone-800 font-medium"
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4 text-stone-600" />
                  <span>ประวัติใบเสนอราคาคลาวด์</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-mono font-bold text-[11px]">
                  {savedCount} ฉบับ
                </span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNewQuote();
                }}
                className="w-full flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl text-stone-800 font-medium"
              >
                <span className="flex items-center gap-2">
                  <FilePlus className="w-4 h-4 text-stone-600" />
                  <span>สร้างใบเสนอราคาใหม่</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl text-stone-800 font-medium"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-stone-600" />
                  <span>ตั้งค่าข้อมูลบริษัทและบัญชีธนาคาร</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenVersion) onOpenVersion();
                }}
                className="w-full flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl text-stone-800 font-medium"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-stone-500" />
                  <span>เวอร์ชันโปรแกรม ({APP_VERSION})</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
