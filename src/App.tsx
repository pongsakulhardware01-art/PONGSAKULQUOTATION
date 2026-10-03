/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useTransition } from 'react';
import {
  QuotationDocument,
  CompanyProfile,
  BankAccount,
  QuotationItem,
} from './types';
import {
  DEFAULT_COMPANY,
  DEFAULT_BANK_ACCOUNTS,
  DEFAULT_TERMS,
  DEFAULT_NOTES,
  createInitialQuotation,
} from './data/defaultData';
import { generateQuoteNumber, recalculateQuotation } from './utils/formatters';
import { Header } from './components/Header';
import { QuotationEditor } from './components/QuotationEditor';
import { QuotationPreview } from './components/QuotationPreview';
import { VisualSettingsToolbar } from './components/VisualSettingsToolbar';
import { ProductCatalogModal } from './components/ProductCatalogModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { CompanySettingsModal } from './components/CompanySettingsModal';
import { ExportJpgModal } from './components/ExportJpgModal';
import { CustomerDatabaseModal } from './components/CustomerDatabaseModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { VersionModal } from './components/VersionModal';
import { APP_VERSION, APP_BUILD_DATE } from './version';
import {
  testFirestoreConnection,
  loginWithGoogle,
  logoutUser,
  onAuthStateChanged,
  auth,
} from './services/firebase';
import {
  subscribeQuotations,
  saveQuotationToCloud,
  deleteQuotationFromCloud,
} from './services/quotationService';
import {
  subscribeCustomers,
  saveCustomerToCloud,
  deleteCustomerFromCloud,
  syncCustomerFromQuote,
} from './services/customerService';
import {
  getNextQuotationNumberFromCloud,
  calculateNextNumberFromList,
} from './services/sequenceService';
import { CustomerRecord, CustomerInfo } from './types';
import {
  downloadElementAsJpg,
  generateJpgDataUrl,
  copyElementImageToClipboard,
  sanitizeFilename,
} from './utils/exportImage';
import { CheckCircle2, AlertCircle, Sparkles, Printer, FileImage } from 'lucide-react';

const STORAGE_KEY_CURRENT = 'pkh_active_quote';
const STORAGE_KEY_HISTORY = 'pkh_saved_quotes_history';
const STORAGE_KEY_CUSTOMERS = 'pkh_customers_cache';
const STORAGE_KEY_COMPANY = 'pkh_company_profile_custom';
const STORAGE_KEY_BANKS = 'pkh_bank_accounts_custom';
const STORAGE_KEY_TERMS = 'pkh_default_terms_custom';
const STORAGE_KEY_NOTES = 'pkh_default_notes_custom';

// Helper to clean legacy dummy customer data
const sanitizeCustomerData = (customer: any) => {
  if (!customer) return customer;
  const sanitized = { ...customer };
  if (sanitized.name === 'คุณสมชาย เจริญกิจ' || sanitized.name?.includes('สมชาย')) {
    sanitized.name = '';
  }
  if (sanitized.companyName?.includes('สมชาย')) {
    sanitized.companyName = '';
  }
  if (sanitized.contactPerson?.includes('สมชาย')) {
    sanitized.contactPerson = '';
  }
  if (sanitized.email?.includes('somchai')) {
    sanitized.email = '';
  }
  return sanitized;
};

// Helper to clean removed company contact info
const sanitizeCompanyData = (company: any) => {
  if (!company) return company;
  const sanitized = { ...company };
  if (sanitized.phone?.includes('083-686-9998') || sanitized.phone?.includes('081-890-5556')) {
    sanitized.phone = '';
  }
  if (sanitized.email?.includes('pongsakulhardware.01@gmail.com')) {
    sanitized.email = '';
  }
  if (sanitized.lineId?.includes('pongsakul_hw')) {
    sanitized.lineId = '';
  }
  return sanitized;
};

const sanitizeSettingsData = (settings: any) => {
  if (!settings) return settings;
  const sanitized = { ...settings };
  if (sanitized.salespersonPhone === '081-890-5556') {
    sanitized.salespersonPhone = '';
  }
  if (sanitized.salespersonEmail?.includes('pongsakulhardware.01@gmail.com')) {
    sanitized.salespersonEmail = '';
  }
  return sanitized;
};

export default function App() {
  const [isPending, startTransition] = useTransition();

  // 1. Initial State Load
  const [quote, setQuote] = useState<QuotationDocument>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customer) {
          parsed.customer = sanitizeCustomerData(parsed.customer);
        }
        if (parsed.company) {
          parsed.company = sanitizeCompanyData(parsed.company);
        }
        if (parsed.settings) {
          parsed.settings = sanitizeSettingsData(parsed.settings);
        }
        const totals = recalculateQuotation(parsed.items || [], parsed.settings || {});
        return { ...parsed, ...totals };
      }
    } catch (e) {
      console.error('Failed to load active quote from localStorage', e);
    }
    return createInitialQuotation();
  });

  const [savedQuotes, setSavedQuotes] = useState<QuotationDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          return list.map((q: QuotationDocument) => ({
            ...q,
            customer: sanitizeCustomerData(q.customer),
            company: sanitizeCompanyData(q.company),
            settings: sanitizeSettingsData(q.settings),
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load quote history', e);
    }
    return [];
  });

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPANY);
      if (saved) return sanitizeCompanyData(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load company profile', e);
    }
    return { ...DEFAULT_COMPANY };
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BANKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load bank accounts', e);
    }
    return [...DEFAULT_BANK_ACCOUNTS];
  });

  const [defaultTerms, setDefaultTerms] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_TERMS) || DEFAULT_TERMS;
  });

  const [defaultNotes, setDefaultNotes] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_NOTES) || DEFAULT_NOTES;
  });

  // 2. UI View and Modals state
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('edit');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportJpgPreviewUrl, setExportJpgPreviewUrl] = useState<string | null>(null);
  const [isExportingJpg, setIsExportingJpg] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email?: string | null; displayName?: string | null } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Customer Database Cache
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load customers cache', e);
    }
    return [];
  });

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 3. Cloud Firestore real-time sync & test connection on mount
  useEffect(() => {
    // Validate connection to Firestore
    testFirestoreConnection().then((ok) => {
      setIsCloudConnected(ok);
    });

    // Auth state listener
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ email: user.email, displayName: user.displayName });
      } else {
        setCurrentUser(null);
      }
    });

    // Quotations real-time subscription
    const unsubQuotes = subscribeQuotations(
      (cloudQuotes) => {
        if (cloudQuotes && cloudQuotes.length > 0) {
          const sanitizedQuotes = cloudQuotes.map((q) => ({
            ...q,
            customer: sanitizeCustomerData(q.customer),
            company: sanitizeCompanyData(q.company),
            settings: sanitizeSettingsData(q.settings),
          }));
          setSavedQuotes(sanitizedQuotes);
          localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(sanitizedQuotes));
        }
        setIsCloudConnected(true);
      },
      (err) => {
        console.warn('Realtime quotations subscription warning:', err);
      }
    );

    // Customers real-time subscription
    const unsubCustomers = subscribeCustomers(
      (cloudCusts) => {
        if (cloudCusts) {
          setCustomers(cloudCusts);
          localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(cloudCusts));
        }
        setIsCloudConnected(true);
      },
      (err) => {
        console.warn('Realtime customers subscription warning:', err);
      }
    );

    return () => {
      unsubAuth();
      unsubQuotes();
      unsubCustomers();
    };
  }, []);

  // 4. Auto save active draft to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(quote));
    } catch (e) {
      console.error('Failed to save active quote', e);
    }
  }, [quote]);

  // 5. Update and recalculate handler
  const handleQuoteChange = (updated: QuotationDocument) => {
    const totals = recalculateQuotation(updated.items, updated.settings);
    setQuote({
      ...updated,
      ...totals,
    });
  };

  const handleUpdateVisualSettings = (field: any, value: any) => {
    const newSettings = {
      ...quote.settings,
      [field]: value,
    };
    const totals = recalculateQuotation(quote.items, newSettings);
    setQuote({
      ...quote,
      settings: newSettings,
      ...totals,
      updatedAt: new Date().toISOString(),
    });
  };

  // 6. Generate next auto-running sequence number
  const handleGenerateNextQuoteNumber = async () => {
    setIsGeneratingNumber(true);
    try {
      const nextNum = await getNextQuotationNumberFromCloud('PKH', savedQuotes);
      setQuote((prev) => ({
        ...prev,
        quoteNumber: nextNum,
        updatedAt: new Date().toISOString(),
      }));
      showToast(`รันเลขที่ใบเสนอราคาใหม่: ${nextNum}`);
    } catch (err) {
      console.error(err);
      const fallback = calculateNextNumberFromList(savedQuotes, 'PKH');
      setQuote((prev) => ({ ...prev, quoteNumber: fallback }));
      showToast(`รันเลขที่ใบเสนอราคา: ${fallback}`);
    } finally {
      setIsGeneratingNumber(false);
    }
  };

  // 7. Create new quotation with sequential running number
  const handleNewQuote = async () => {
    const freshQuote = createInitialQuotation();
    freshQuote.company = { ...companyProfile };
    freshQuote.bankAccounts = [...bankAccounts];
    freshQuote.terms = defaultTerms;
    freshQuote.notes = defaultNotes;

    // Generate auto-running sequential number
    const nextNum = await getNextQuotationNumberFromCloud('PKH', savedQuotes);
    freshQuote.quoteNumber = nextNum;
    freshQuote.id = 'quote-' + Date.now();

    const totals = recalculateQuotation(freshQuote.items, freshQuote.settings);
    setQuote({ ...freshQuote, ...totals });
    showToast(`สร้างใบเสนอราคาใหม่ (${nextNum}) เรียบร้อยแล้ว`, 'info');
  };

  // 8. Save quotation to Cloud Firestore and permanent history list
  const handleSaveToHistory = async () => {
    const quoteToSave: QuotationDocument = {
      ...quote,
      updatedAt: new Date().toISOString(),
      createdBy: currentUser?.email || 'ทีมงานพงษ์สกุล ฮาร์ดแวร์',
    };

    // Save to Cloud Firestore
    try {
      await saveQuotationToCloud(quoteToSave, currentUser?.email || undefined);
      // Auto-sync customer into Customer Database if customer info provided
      await syncCustomerFromQuote(quoteToSave.customer, quoteToSave.grandTotal, currentUser?.email || undefined);
      showToast(`บันทึกใบเสนอราคา ${quote.quoteNumber} ขึ้น Cloud เรียบร้อยแล้ว`, 'success');
    } catch (err) {
      console.warn('Save to cloud warning, saving locally:', err);
      showToast(`บันทึกใบเสนอราคา ${quote.quoteNumber} (ในเครื่อง)`, 'info');
    }

    // Local state & storage backup
    const updatedHistory = [...savedQuotes];
    const existingIndex = updatedHistory.findIndex((q) => q.id === quote.id);
    if (existingIndex >= 0) {
      updatedHistory[existingIndex] = quoteToSave;
    } else {
      updatedHistory.unshift(quoteToSave);
    }
    setSavedQuotes(updatedHistory);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
  };

  // 9. Load Quote from history
  const handleLoadQuote = (selected: QuotationDocument) => {
    const totals = recalculateQuotation(selected.items, selected.settings);
    setQuote({ ...selected, ...totals });
    showToast(`เปิดใบเสนอราคา ${selected.quoteNumber} แล้ว`, 'info');
  };

  // 10. Duplicate Quote
  const handleDuplicateQuote = async (sourceQuote: QuotationDocument) => {
    const newId = 'quote-' + Date.now();
    const nextNum = await getNextQuotationNumberFromCloud('PKH', savedQuotes);

    const duplicated: QuotationDocument = {
      ...sourceQuote,
      id: newId,
      quoteNumber: nextNum,
      referenceNo: sourceQuote.quoteNumber,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser?.email || 'ทีมงานพงษ์สกุล ฮาร์ดแวร์',
    };
    const totals = recalculateQuotation(duplicated.items, duplicated.settings);
    const finalDup = { ...duplicated, ...totals };

    // Save to Cloud and local
    try {
      await saveQuotationToCloud(finalDup, currentUser?.email || undefined);
    } catch (e) {
      console.warn(e);
    }

    const newHistory = [finalDup, ...savedQuotes];
    setSavedQuotes(newHistory);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));

    setQuote(finalDup);
    setIsHistoryOpen(false);
    showToast(`คัดลอกเป็นใบเสนอราคาใหม่ (${finalDup.quoteNumber}) เรียบร้อยแล้ว`, 'success');
  };

  // 11. Delete Quote
  const handleDeleteQuote = async (id: string) => {
    if (confirm('คุณต้องการลบใบเสนอราคานี้ใช่หรือไม่?')) {
      try {
        await deleteQuotationFromCloud(id);
      } catch (e) {
        console.warn('Cloud delete warning:', e);
      }
      const updated = savedQuotes.filter((q) => q.id !== id);
      setSavedQuotes(updated);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      showToast('ลบใบเสนอราคาเรียบร้อยแล้ว', 'info');
    }
  };

  // 12. Customer Database Operations
  const handleSaveCustomer = async (cust: Partial<CustomerRecord> & { name: string }) => {
    const id = await saveCustomerToCloud(cust, currentUser?.email || undefined);
    const updatedCusts = [...customers];
    const idx = updatedCusts.findIndex((c) => c.id === id);
    const newRecord: CustomerRecord = {
      id,
      name: cust.name,
      companyName: cust.companyName || cust.name,
      taxId: cust.taxId || '',
      branch: cust.branch || 'สำนักงานใหญ่',
      address: cust.address || '',
      contactPerson: cust.contactPerson || '',
      phone: cust.phone || '',
      email: cust.email || '',
      notes: cust.notes || '',
      createdAt: cust.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser?.email || 'ทีมงานพงษ์สกุล ฮาร์ดแวร์',
    };
    if (idx >= 0) {
      updatedCusts[idx] = newRecord;
    } else {
      updatedCusts.unshift(newRecord);
    }
    setCustomers(updatedCusts);
    localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(updatedCusts));
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await deleteCustomerFromCloud(id);
    } catch (e) {
      console.warn(e);
    }
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(updated));
    showToast('ลบข้อมูลลูกค้าเรียบร้อยแล้ว');
  };

  const handleSelectCustomerForCurrentQuote = (custInfo: CustomerInfo) => {
    setQuote((prev) => ({
      ...prev,
      customer: { ...custInfo },
      updatedAt: new Date().toISOString(),
    }));
    showToast(`ใส่ข้อมูลลูกค้า "${custInfo.companyName || custInfo.name}" ในใบเสนอราคานี้แล้ว`);
  };

  const handleCreateQuoteForCustomer = async (custInfo: CustomerInfo) => {
    const freshQuote = createInitialQuotation();
    freshQuote.company = { ...companyProfile };
    freshQuote.bankAccounts = [...bankAccounts];
    freshQuote.terms = defaultTerms;
    freshQuote.notes = defaultNotes;
    freshQuote.customer = { ...custInfo };

    const nextNum = await getNextQuotationNumberFromCloud('PKH', savedQuotes);
    freshQuote.quoteNumber = nextNum;
    freshQuote.id = 'quote-' + Date.now();

    const totals = recalculateQuotation(freshQuote.items, freshQuote.settings);
    setQuote({ ...freshQuote, ...totals });
    showToast(`เปิดใบเสนอราคาใหม่ (${nextNum}) สำหรับ ${custInfo.companyName || custInfo.name}`, 'success');
  };

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        setCurrentUser({ email: user.email, displayName: user.displayName });
        showToast(`ยินดีต้อนรับ ${user.displayName || user.email}`);
      }
    } catch (err) {
      console.error(err);
      showToast('ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง', 'info');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      showToast('ออกจากระบบเรียบร้อยแล้ว');
    } catch (err) {
      console.error(err);
    }
  };

  // 10. Catalog Item Selection
  const handleSelectCatalogItem = (newItem: QuotationItem) => {
    const updatedItems = [...quote.items];
    // Check if the only existing item is empty/blank
    if (
      updatedItems.length === 1 &&
      !updatedItems[0].description &&
      updatedItems[0].unitPrice === 0
    ) {
      updatedItems[0] = newItem;
    } else {
      updatedItems.push(newItem);
    }

    const totals = recalculateQuotation(updatedItems, quote.settings);
    setQuote({
      ...quote,
      items: updatedItems,
      ...totals,
      updatedAt: new Date().toISOString(),
    });
    showToast(`เพิ่ม "${newItem.description}" ลงในใบเสนอราคาแล้ว`);
  };

  // 11. Company Settings Save
  const handleSaveSettings = (
    newCompany: CompanyProfile,
    newBanks: BankAccount[],
    newTerms: string,
    newNotes: string
  ) => {
    setCompanyProfile(newCompany);
    setBankAccounts(newBanks);
    setDefaultTerms(newTerms);
    setDefaultNotes(newNotes);

    localStorage.setItem(STORAGE_KEY_COMPANY, JSON.stringify(newCompany));
    localStorage.setItem(STORAGE_KEY_BANKS, JSON.stringify(newBanks));
    localStorage.setItem(STORAGE_KEY_TERMS, newTerms);
    localStorage.setItem(STORAGE_KEY_NOTES, newNotes);

    // Also update current quote's company and bank details
    setQuote((prev) => ({
      ...prev,
      company: newCompany,
      bankAccounts: newBanks,
    }));

    showToast('บันทึกข้อมูลบริษัทเรียบร้อยแล้ว');
  };

  // 12. Backup Export & Import
  const handleExportAll = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      companyProfile,
      savedQuotes,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pongsakul-quotations-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ส่งออกไฟล์สำรองข้อมูลสำเร็จ');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.savedQuotes && Array.isArray(parsed.savedQuotes)) {
          setSavedQuotes(parsed.savedQuotes);
          localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(parsed.savedQuotes));
          if (parsed.companyProfile) {
            setCompanyProfile(parsed.companyProfile);
            localStorage.setItem(STORAGE_KEY_COMPANY, JSON.stringify(parsed.companyProfile));
          }
          showToast(`นำเข้าข้อมูลสำเร็จ (${parsed.savedQuotes.length} ฉบับ)`);
        } else {
          alert('รูปแบบไฟล์ไม่ถูกต้อง');
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON');
      }
    };
    reader.readAsText(file);
  };

  // 13. Print action
  const handlePrint = () => {
    // If in edit mode on mobile/desktop, we don't need to force viewMode change because print media handles everything
    window.print();
  };

  // 14. JPG Export actions
  const handleExportJpgDirect = async () => {
    const targetElement = document.getElementById('export-quotation-target');
    if (!targetElement) {
      showToast('ไม่พบข้อมูลเอกสารสำหรับส่งออกภาพ', 'info');
      return;
    }

    setIsExportingJpg(true);
    try {
      const rawClient = (quote.customer.companyName || quote.customer.name || '').trim();
      const clientName = rawClient && !rawClient.includes('สมชาย') ? rawClient : 'ลูกค้า';
      const filename = sanitizeFilename(`ใบเสนอราคา_${quote.quoteNumber}_${clientName}.jpg`);

      const dataUrl = await downloadElementAsJpg(targetElement, filename, {
        pixelRatio: 2,
        quality: 0.95,
      });

      setExportJpgPreviewUrl(dataUrl);
      showToast(`ดาวน์โหลดรูปภาพ ${quote.quoteNumber}.jpg สำเร็จแล้ว`, 'success');
    } catch (err) {
      console.error('Failed to export JPG', err);
      showToast('เกิดข้อผิดพลาดในการสร้างรูปภาพ JPG กรุณาลองใหม่อีกครั้ง', 'info');
    } finally {
      setIsExportingJpg(false);
    }
  };

  const handleOpenExportModal = async () => {
    setIsExportModalOpen(true);
    const targetElement = document.getElementById('export-quotation-target');
    if (targetElement) {
      setIsExportingJpg(true);
      try {
        const dataUrl = await generateJpgDataUrl(targetElement, {
          pixelRatio: 2,
          quality: 0.95,
        });
        setExportJpgPreviewUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate JPG preview', err);
      } finally {
        setIsExportingJpg(false);
      }
    }
  };

  const handleRegenerateResolution = async (resolution: 'standard' | 'high' | 'ultra') => {
    const targetElement = document.getElementById('export-quotation-target');
    if (!targetElement) return;

    setIsExportingJpg(true);
    try {
      const ratio = resolution === 'standard' ? 1 : resolution === 'ultra' ? 3 : 2;
      const dataUrl = await generateJpgDataUrl(targetElement, {
        pixelRatio: ratio,
        quality: 0.95,
      });
      setExportJpgPreviewUrl(dataUrl);
    } catch (err) {
      console.error('Failed to regenerate resolution', err);
    } finally {
      setIsExportingJpg(false);
    }
  };

  const handleModalDownload = () => {
    if (!exportJpgPreviewUrl) {
      handleExportJpgDirect();
      return;
    }
    const rawClient = (quote.customer.companyName || quote.customer.name || '').trim();
    const clientName = rawClient && !rawClient.includes('สมชาย') ? rawClient : 'ลูกค้า';
    const filename = sanitizeFilename(`ใบเสนอราคา_${quote.quoteNumber}_${clientName}.jpg`);
    const link = document.createElement('a');
    link.download = filename;
    link.href = exportJpgPreviewUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`ดาวน์โหลด ${filename} เรียบร้อยแล้ว`, 'success');
  };

  const handleCopyClipboard = async (): Promise<boolean> => {
    const targetElement = document.getElementById('export-quotation-target');
    if (!targetElement) return false;

    try {
      const ok = await copyElementImageToClipboard(targetElement, 2);
      if (ok) {
        showToast('คัดลอกรูปภาพแล้ว! กด Ctrl+V ในแชต LINE ได้เลย', 'success');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Copy to clipboard failed', err);
      showToast('เบราว์เซอร์ไม่รองรับการคัดลอกภาพโดยตรง แนะนำให้กดปุ่มดาวน์โหลดแทน', 'info');
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onNewQuote={handleNewQuote}
        onSaveQuote={handleSaveToHistory}
        onPrint={handlePrint}
        onExportJpg={handleOpenExportModal}
        onOpenPreview={() => setIsPreviewModalOpen(true)}
        isExportingJpg={isExportingJpg}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCustomers={() => setIsCustomerModalOpen(true)}
        onOpenVersion={() => setIsVersionModalOpen(true)}
        customerCount={customers.length}
        savedCount={savedQuotes.length}
        quoteNumber={quote.quoteNumber}
        isCloudConnected={isCloudConnected}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Workspace Area: Clean, Spacious, and Uncluttered */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 no-print">
        <QuotationEditor
          quote={quote}
          onChange={handleQuoteChange}
          onOpenCatalog={() => setIsCatalogOpen(true)}
          customers={customers}
          savedQuotes={savedQuotes}
          onOpenCustomerDB={() => setIsCustomerModalOpen(true)}
          onSaveCustomerToDB={async (cust) => {
            await handleSaveCustomer({ ...cust, name: cust.companyName || cust.name });
          }}
          onGenerateNextNumber={handleGenerateNextQuoteNumber}
          isGeneratingNumber={isGeneratingNumber}
          onOpenPreview={() => setIsPreviewModalOpen(true)}
          onExportJpg={handleOpenExportModal}
          onPrint={handlePrint}
        />

        {/* Hidden on screen, rendered exclusively for browser @media print */}
        <div className="print-only hidden">
          <QuotationPreview quote={quote} />
        </div>

        {/* Application Footer */}
        <footer className="no-print pt-8 pb-3 text-center text-xs text-stone-500 border-t border-stone-200/80 mt-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>© {new Date().getFullYear()} บริษัท พงษ์สกุล ฮาร์ดแวร์ จำกัด</span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <button
              type="button"
              onClick={() => setIsVersionModalOpen(true)}
              className="inline-flex items-center gap-1 font-mono font-medium text-stone-600 hover:text-red-700 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded transition cursor-pointer"
              title="ดูประวัติการปรับปรุงเวอร์ชัน"
            >
              <span>เวอร์ชัน {APP_VERSION}</span>
              <span className="text-[10px] text-stone-400">({APP_BUILD_DATE})</span>
            </button>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span>ระบบออกใบเสนอราคามาตรฐาน A4 / Cloud Sync</span>
          </div>
        </footer>
      </main>

      {/* Dedicated Offscreen Unscaled A4 Container for 100% Crisp JPG Generation */}
      <div
        id="export-container-offscreen"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '794px',
          minHeight: '1123px',
          backgroundColor: '#ffffff',
          zIndex: -999,
          pointerEvents: 'none',
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <div id="export-quotation-target">
          <QuotationPreview
            quote={quote}
            isExportMode={true}
            containerId="export-quotation-a4-canvas"
          />
        </div>
      </div>

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-800 text-xs sm:text-sm animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <ExportJpgModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        quote={quote}
        dataUrl={exportJpgPreviewUrl}
        isGenerating={isExportingJpg}
        onRegenerate={handleRegenerateResolution}
        onDownload={handleModalDownload}
        onCopyClipboard={handleCopyClipboard}
      />

      <ProductCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectProduct={handleSelectCatalogItem}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedQuotes={savedQuotes}
        activeQuoteId={quote.id}
        onLoadQuote={handleLoadQuote}
        onDuplicateQuote={handleDuplicateQuote}
        onDeleteQuote={handleDeleteQuote}
        onExportAll={handleExportAll}
        onImportFile={handleImportFile}
        onPullItemsToActive={(source) => {
          const clonedItems: QuotationItem[] = source.items.map((it, idx) => ({
            ...it,
            id: `item-${Date.now()}-${idx}`,
          }));
          const totals = recalculateQuotation(clonedItems, quote.settings);
          setQuote((prev) => ({
            ...prev,
            referenceNo: source.quoteNumber,
            items: clonedItems,
            ...totals,
            updatedAt: new Date().toISOString(),
          }));
          showToast(`ดึง ${clonedItems.length} รายการและราคาเดิมจาก "${source.quoteNumber}" เรียบร้อยแล้ว`, 'success');
        }}
      />

      <CompanySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        company={companyProfile}
        bankAccounts={bankAccounts}
        defaultTerms={defaultTerms}
        defaultNotes={defaultNotes}
        onSaveSettings={handleSaveSettings}
      />

      {/* Customer Database Modal */}
      <CustomerDatabaseModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customers={customers}
        onSelectCustomer={handleSelectCustomerForCurrentQuote}
        onSaveCustomer={handleSaveCustomer}
        onDeleteCustomer={handleDeleteCustomer}
        onCreateQuoteForCustomer={handleCreateQuoteForCustomer}
        isCloudConnected={isCloudConnected}
      />

      {/* Document A4 Preview Modal (On-Demand & Clean) */}
      <DocumentPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        quote={quote}
        onPrint={handlePrint}
        onExportJpg={handleOpenExportModal}
        isExportingJpg={isExportingJpg}
        onUpdateSettings={handleUpdateVisualSettings}
      />

      {/* Version Information & Changelog Modal */}
      <VersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />
    </div>
  );
}
