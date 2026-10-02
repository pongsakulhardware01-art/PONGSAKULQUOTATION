import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
  ExternalLink,
  ShieldCheck,
  CloudCheck,
} from 'lucide-react';
import { CustomerRecord, CustomerInfo } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CustomerDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerRecord[];
  onSelectCustomer: (customer: CustomerInfo) => void;
  onSaveCustomer: (customer: Partial<CustomerRecord> & { name: string }) => Promise<void>;
  onDeleteCustomer: (id: string) => Promise<void>;
  onCreateQuoteForCustomer: (customer: CustomerInfo) => void;
  isCloudConnected: boolean;
}

export const CustomerDatabaseModal: React.FC<CustomerDatabaseModalProps> = ({
  isOpen,
  onClose,
  customers,
  onSelectCustomer,
  onSaveCustomer,
  onDeleteCustomer,
  onCreateQuoteForCustomer,
  isCloudConnected,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Partial<CustomerRecord>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.companyName && c.companyName.toLowerCase().includes(term)) ||
        (c.taxId && c.taxId.includes(term)) ||
        (c.phone && c.phone.includes(term)) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(term)) ||
        (c.email && c.email.toLowerCase().includes(term))
    );
  }, [customers, searchTerm]);

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setCurrentEdit({
      name: '',
      companyName: '',
      taxId: '',
      branch: 'สำนักงานใหญ่',
      address: '',
      contactPerson: '',
      phone: '',
      email: '',
      notes: '',
    });
    setIsEditing(true);
  };

  const handleStartEdit = (customer: CustomerRecord) => {
    setCurrentEdit({ ...customer });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit.name?.trim()) {
      alert('กรุณากรอกชื่อลูกค้าหรือชื่อบริษัท');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveCustomer({
        ...currentEdit,
        name: currentEdit.name.trim(),
        companyName: currentEdit.companyName?.trim() || currentEdit.name.trim(),
      });
      setIsEditing(false);
      setSuccessToast('บันทึกข้อมูลลูกค้าลงฐานข้อมูลคลาวด์เรียบร้อยแล้ว');
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`คุณต้องการลบข้อมูลลูกค้า "${name}" ออกจากฐานข้อมูลใช่หรือไม่?`)) {
      try {
        await onDeleteCustomer(id);
      } catch (err) {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  const handleApplyToCurrent = (c: CustomerRecord) => {
    onSelectCustomer({
      name: c.name,
      companyName: c.companyName || c.name,
      taxId: c.taxId || '',
      branch: c.branch || 'สำนักงานใหญ่',
      address: c.address || '',
      contactPerson: c.contactPerson || '',
      phone: c.phone || '',
      email: c.email || '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">ฐานข้อมูลลูกค้า (Customer Database)</h3>
                {isCloudConnected ? (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                    <CloudCheck className="w-3 h-3 text-emerald-400" /> ซิงค์คลาวด์สด
                  </span>
                ) : (
                  <span className="text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full">
                    โหมดออฟไลน์
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                จัดการรายชื่อลูกค้า เลขผู้เสียภาษี และที่อยู่อย่างเป็นระเบียบ เชื่อมโยงทุกเครื่องในทีม
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Content Body */}
        {isEditing ? (
          /* Edit/Add Form */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h4 className="font-bold text-stone-800 text-sm sm:text-base flex items-center gap-2">
                {currentEdit.id ? <Edit2 className="w-4 h-4 text-red-600" /> : <Plus className="w-4 h-4 text-red-600" />}
                {currentEdit.id ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่เข้าระบบคลาวด์'}
              </h4>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs text-stone-500 hover:text-stone-800 px-2.5 py-1 rounded-md border border-stone-300"
              >
                ย้อนกลับไปรายการ
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="sm:col-span-2">
                <label className="block font-medium text-stone-700 mb-1">
                  ชื่อบริษัท / นิติบุคคล / ชื่อลูกค้า <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentEdit.name || ''}
                  onChange={(e) =>
                    setCurrentEdit({ ...currentEdit, name: e.target.value, companyName: e.target.value })
                  }
                  placeholder="เช่น บริษัท สมุทรปราการ เอ็นจิเนียริ่ง จำกัด"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  เลขประจำตัวผู้เสียภาษี (13 หลัก)
                </label>
                <input
                  type="text"
                  maxLength={18}
                  value={currentEdit.taxId || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, taxId: e.target.value })}
                  placeholder="เช่น 0115559001234"
                  className="w-full font-mono px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">สาขา</label>
                <input
                  type="text"
                  value={currentEdit.branch || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, branch: e.target.value })}
                  placeholder="เช่น สำนักงานใหญ่ หรือ สาขา 00001"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-stone-700 mb-1">
                  ที่อยู่จดทะเบียน / ออกใบกำกับภาษี
                </label>
                <textarea
                  rows={2}
                  value={currentEdit.address || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, address: e.target.value })}
                  placeholder="เลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">ชื่อผู้ติดต่อ / ฝ่ายจัดซื้อ</label>
                <input
                  type="text"
                  value={currentEdit.contactPerson || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, contactPerson: e.target.value })}
                  placeholder="เช่น ฝ่ายจัดซื้อ / คุณวิชัย"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  value={currentEdit.phone || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, phone: e.target.value })}
                  placeholder="เช่น 02-123-4567, 089-999-9999"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">อีเมล</label>
                <input
                  type="email"
                  value={currentEdit.email || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, email: e.target.value })}
                  placeholder="เช่น purchase@company.com"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">หมายเหตุภายใน (Notes)</label>
                <input
                  type="text"
                  value={currentEdit.notes || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, notes: e.target.value })}
                  placeholder="เช่น เครดิต 30 วัน, ส่งของช่วงเช้า"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg border border-stone-300"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกลงฐานข้อมูลคลาวด์'}
              </button>
            </div>
          </form>
        ) : (
          /* List & Search View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Action Bar */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาลูกค้าด้วย ชื่อ, เลขผู้เสียภาษี, เบอร์โทร, หรือผู้ติดต่อ..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={handleStartAdd}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                เพิ่มลูกค้าใหม่
              </button>
            </div>

            {/* Customer List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-stone-700 mb-1">
                    {searchTerm ? 'ไม่พบข้อมูลลูกค้าที่ค้นหา' : 'ยังไม่มีข้อมูลลูกค้าในระบบคลาวด์'}
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                    {searchTerm
                      ? 'ลองค้นหาด้วยคำอื่น หรือกด "เพิ่มลูกค้าใหม่" เพื่อสร้างข้อมูลเข้าระบบ'
                      : 'คุณสามารถเพิ่มลูกค้าใหม่ หรือเมื่อกรอกข้อมูลลูกค้าในใบเสนอราคา ระบบจะจัดเก็บและจำให้อัตโนมัติ'}
                  </p>
                  <button
                    onClick={handleStartAdd}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition"
                  >
                    <Plus className="w-4 h-4" />
                    เพิ่มลูกค้ารายแรก
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-stone-500 font-medium px-1 flex items-center justify-between">
                    <span>พบทั้งหมด {filteredCustomers.length} รายการ</span>
                    <span className="text-[11px] text-stone-400">เรียงตามการอัปเดตล่าสุด</span>
                  </div>

                  {filteredCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      className="bg-white border border-stone-200 hover:border-red-300 rounded-xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h5 className="font-bold text-sm sm:text-base text-stone-900 truncate">
                            {cust.companyName || cust.name}
                          </h5>
                          {cust.taxId && (
                            <span className="inline-flex items-center text-[10.5px] font-mono font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                              Tax: {cust.taxId} ({cust.branch || 'สำนักงานใหญ่'})
                            </span>
                          )}
                          {cust.quoteCount !== undefined && cust.quoteCount > 0 && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {cust.quoteCount} ใบเสนอราคา
                            </span>
                          )}
                        </div>

                        {cust.address && (
                          <p className="text-xs text-stone-600 flex items-start gap-1.5 line-clamp-1 mb-1.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                            <span>{cust.address}</span>
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                          {cust.contactPerson && (
                            <span className="flex items-center gap-1 text-stone-700 font-medium">
                              ผู้ติดต่อ: {cust.contactPerson}
                            </span>
                          )}
                          {cust.phone && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-stone-400" />
                              {cust.phone}
                            </span>
                          )}
                          {cust.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-stone-400" />
                              {cust.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 justify-end">
                        <button
                          onClick={() => handleApplyToCurrent(cust)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition flex items-center gap-1"
                          title="นำข้อมูลลูกค้าใส่ในใบเสนอราคาปัจจุบัน"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          ใส่ในใบเสนอราคานี้
                        </button>
                        <button
                          onClick={() => {
                            onCreateQuoteForCustomer({
                              name: cust.name,
                              companyName: cust.companyName || cust.name,
                              taxId: cust.taxId || '',
                              branch: cust.branch || 'สำนักงานใหญ่',
                              address: cust.address || '',
                              contactPerson: cust.contactPerson || '',
                              phone: cust.phone || '',
                              email: cust.email || '',
                            });
                            onClose();
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition hidden sm:inline-flex items-center gap-1"
                          title="เริ่มใบเสนอราคาใหม่ให้ลูกค้ารายนี้"
                        >
                          <Plus className="w-3 h-3" />
                          เปิดใบใหม่
                        </button>
                        <button
                          onClick={() => handleStartEdit(cust)}
                          className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition"
                          title="แก้ไขข้อมูลลูกค้า"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cust.id, cust.name)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="ลบข้อมูลลูกค้า"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between px-5">
              <span>ฐานข้อมูลลูกค้าพงษ์สกุล ฮาร์ดแวร์ จัดเก็บและซิงค์ผ่านคลาวด์แบบ Realtime</span>
              <button
                onClick={onClose}
                className="px-3 py-1 bg-white border border-stone-300 rounded-md text-stone-700 hover:bg-stone-100 text-xs font-medium"
              >
                ปิด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
