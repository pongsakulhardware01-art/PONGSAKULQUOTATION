import React, { useState, useRef } from 'react';
import { CompanyProfile, BankAccount } from '../types';
import { X, Building2, Save, CreditCard, Plus, Trash2, RotateCcw, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { DEFAULT_COMPANY, DEFAULT_BANK_ACCOUNTS, DEFAULT_TERMS, DEFAULT_NOTES } from '../data/defaultData';
import { LogoEmblem } from './LogoEmblem';
import { APP_VERSION } from '../version';

interface CompanySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyProfile;
  bankAccounts: BankAccount[];
  defaultTerms: string;
  defaultNotes: string;
  onSaveSettings: (
    newCompany: CompanyProfile,
    newBanks: BankAccount[],
    newTerms: string,
    newNotes: string
  ) => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({
  isOpen,
  onClose,
  company,
  bankAccounts,
  defaultTerms,
  defaultNotes,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<CompanyProfile>({ ...company });
  const [banks, setBanks] = useState<BankAccount[]>([...bankAccounts]);
  const [terms, setTerms] = useState(defaultTerms);
  const [notes, setNotes] = useState(defaultNotes);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddBank = () => {
    const newBank: BankAccount = {
      id: 'bank-' + Date.now(),
      bankName: 'ธนาคารกสิกรไทย',
      accountNumber: '',
      accountName: formData.nameTh || 'บจก. พงษ์สกุล ฮาร์ดแวร์',
      branch: '',
    };
    setBanks([...banks, newBank]);
  };

  const handleBankChange = (index: number, field: keyof BankAccount, value: string) => {
    const updated = [...banks];
    updated[index] = { ...updated[index], [field]: value };
    setBanks(updated);
  };

  const handleDeleteBank = (index: number) => {
    setBanks(banks.filter((_, i) => i !== index));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('กรุณาเลือกไฟล์ภาพขนาดไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, logoUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('คุณต้องการคืนค่าข้อมูลบริษัทเป็นค่าเริ่มต้นตามที่ระบุไว้หรือไม่?')) {
      setFormData({ ...DEFAULT_COMPANY });
      setBanks([...DEFAULT_BANK_ACCOUNTS]);
      setTerms(DEFAULT_TERMS);
      setNotes(DEFAULT_NOTES);
    }
  };

  const handleSave = () => {
    onSaveSettings(formData, banks, terms, notes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">ตั้งค่าข้อมูลบริษัท & โลโก้</h2>
              <p className="text-xs text-stone-300">
                ข้อมูลหัวเอกสาร โลโก้ทางการ บัญชีธนาคาร และเงื่อนไขเริ่มต้น
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Logo Section */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                <span>โลโก้บริษัท / Company Logo</span>
              </h3>
              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logoUrl: '' })}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold"
                >
                  ใช้โลโก้ทางการ (Official Vector)
                </button>
              )}
            </div>

            {/* Logo Preview Box */}
            <div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="overflow-x-auto max-w-full">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Uploaded Logo"
                    className="max-h-16 max-w-[260px] object-contain"
                  />
                ) : (
                  <LogoEmblem
                    size="banner-md"
                    variant="full-banner"
                    phone={formData.phone?.split(',')[0]?.trim() || '083-686-9998'}
                  />
                )}
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>อัปโหลดรูปภาพใหม่</span>
                </button>
                <span className="text-[10px] text-stone-500 text-center sm:text-right">
                  รองรับ PNG, JPG ขนาดไม่เกิน 2MB
                </span>
              </div>
            </div>
          </div>

          {/* Company details */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span>ข้อมูลนิติบุคคล</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">
                  ชื่อบริษัท (ภาษาไทย) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nameTh}
                  onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
                  className="w-full text-sm font-semibold rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">
                  ชื่อบริษัท (English)
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full text-sm font-semibold rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  เลขประจำตัวผู้เสียภาษี (13 หลัก) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full text-sm font-mono rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  สาขา
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
                  placeholder="สำนักงานใหญ่"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">
                  ที่อยู่สถานประกอบการ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  เบอร์โทรศัพท์ (เช่น 083-686-9998)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  อีเมลบริษัท
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Line ID
                </label>
                <input
                  type="text"
                  value={formData.lineId}
                  onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  เว็บไซต์
                </label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full text-sm rounded-lg px-3 py-2 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Bank accounts */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-600" />
                <span>บัญชีธนาคารสำหรับรับชำระเงิน</span>
              </h3>
              <button
                onClick={handleAddBank}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 py-1 px-2.5 rounded-lg bg-red-50 hover:bg-red-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มบัญชี</span>
              </button>
            </div>

            <div className="space-y-3">
              {banks.map((bank, index) => (
                <div
                  key={bank.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row gap-2 items-center"
                >
                  <input
                    type="text"
                    value={bank.bankName}
                    onChange={(e) => handleBankChange(index, 'bankName', e.target.value)}
                    placeholder="ชื่อธนาคาร (เช่น กสิกรไทย)"
                    className="w-full sm:w-1/3 text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                  <input
                    type="text"
                    value={bank.accountNumber}
                    onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)}
                    placeholder="เลขที่บัญชี"
                    className="w-full sm:w-1/3 text-xs font-mono bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                  <input
                    type="text"
                    value={bank.accountName}
                    onChange={(e) => handleBankChange(index, 'accountName', e.target.value)}
                    placeholder="ชื่อบัญชี"
                    className="w-full sm:w-1/3 text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                  <button
                    onClick={() => handleDeleteBank(index)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Default terms & notes */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h3 className="text-sm font-bold text-stone-900">เงื่อนไขและหมายเหตุเริ่มต้น</h3>
            <div>
              <label className="block text-xs text-stone-700 font-medium mb-1">
                เงื่อนไขการค้าเริ่มต้น (Terms & Conditions)
              </label>
              <textarea
                rows={3}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full text-xs rounded-lg p-2.5 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-700 font-medium mb-1">
                หมายเหตุเริ่มต้น (Notes / Remarks)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs rounded-lg p-2.5 border border-stone-300 focus:ring-2 focus:ring-red-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium py-2 px-3 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>คืนค่าเริ่มต้น</span>
            </button>
            <span className="text-[11px] text-stone-400 font-mono">
              v{APP_VERSION}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
