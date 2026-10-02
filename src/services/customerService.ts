import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { CustomerInfo, CustomerRecord } from '../types';

const CUSTOMERS_COLLECTION = 'customers';

/**
 * Real-time listener for customers database
 */
export function subscribeCustomers(
  onData: (customers: CustomerRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(collection(db, CUSTOMERS_COLLECTION), orderBy('updatedAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const list: CustomerRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push({
          ...(docSnap.data() as CustomerRecord),
          id: docSnap.id,
        });
      });
      onData(list);
    },
    (error) => {
      console.error('Error listening to customers:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, CUSTOMERS_COLLECTION);
    }
  );

  return unsubscribe;
}

/**
 * Save or update customer record in Cloud database
 */
export async function saveCustomerToCloud(
  customer: Partial<CustomerRecord> & { name: string },
  userEmail?: string
): Promise<string> {
  const now = new Date().toISOString();
  const id =
    customer.id ||
    'cust_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  const path = `${CUSTOMERS_COLLECTION}/${id}`;

  const cleanRecord: CustomerRecord = {
    id,
    name: customer.name.trim(),
    companyName: customer.companyName?.trim() || customer.name.trim(),
    taxId: customer.taxId?.trim() || '',
    branch: customer.branch?.trim() || 'สำนักงานใหญ่',
    address: customer.address?.trim() || '',
    contactPerson: customer.contactPerson?.trim() || '',
    phone: customer.phone?.trim() || '',
    email: customer.email?.trim() || '',
    notes: customer.notes?.trim() || '',
    quoteCount: customer.quoteCount || 0,
    totalAmount: customer.totalAmount || 0,
    createdAt: customer.createdAt || now,
    updatedAt: now,
    createdBy: customer.createdBy || userEmail || 'ทีมงานพงษ์สกุล ฮาร์ดแวร์',
  };

  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, id);
    await setDoc(docRef, cleanRecord, { merge: true });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete customer record from Cloud database
 */
export async function deleteCustomerFromCloud(customerId: string): Promise<void> {
  const path = `${CUSTOMERS_COLLECTION}/${customerId}`;
  try {
    await deleteDoc(doc(db, CUSTOMERS_COLLECTION, customerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Auto-sync or update customer profile when generating a quote
 */
export async function syncCustomerFromQuote(
  customerInfo: CustomerInfo,
  quoteGrandTotal = 0,
  userEmail?: string
): Promise<string | null> {
  const primaryName = (customerInfo.companyName || customerInfo.name || '').trim();
  if (!primaryName || primaryName === 'ลูกค้าทั่วไป' || primaryName === '-') {
    return null;
  }

  try {
    // Check if customer already exists in cloud by name or taxId
    const snap = await getDocs(collection(db, CUSTOMERS_COLLECTION));
    let existingDoc: CustomerRecord | null = null;

    snap.forEach((d) => {
      const data = d.data() as CustomerRecord;
      if (
        (customerInfo.taxId && data.taxId && data.taxId.trim() === customerInfo.taxId.trim()) ||
        (data.name && data.name.trim().toLowerCase() === primaryName.toLowerCase()) ||
        (data.companyName && data.companyName.trim().toLowerCase() === primaryName.toLowerCase())
      ) {
        existingDoc = { ...data, id: d.id };
      }
    });

    const now = new Date().toISOString();
    const id = existingDoc ? existingDoc.id : 'cust_' + Date.now().toString(36);

    const updatedRecord: CustomerRecord = {
      id,
      name: primaryName,
      companyName: customerInfo.companyName?.trim() || primaryName,
      taxId: customerInfo.taxId?.trim() || existingDoc?.taxId || '',
      branch: customerInfo.branch?.trim() || existingDoc?.branch || 'สำนักงานใหญ่',
      address: customerInfo.address?.trim() || existingDoc?.address || '',
      contactPerson: customerInfo.contactPerson?.trim() || existingDoc?.contactPerson || '',
      phone: customerInfo.phone?.trim() || existingDoc?.phone || '',
      email: customerInfo.email?.trim() || existingDoc?.email || '',
      notes: existingDoc?.notes || '',
      quoteCount: (existingDoc?.quoteCount || 0) + 1,
      totalAmount: (existingDoc?.totalAmount || 0) + quoteGrandTotal,
      createdAt: existingDoc?.createdAt || now,
      updatedAt: now,
      createdBy: existingDoc?.createdBy || userEmail || 'ระบบสร้างใบเสนอราคา',
    };

    const docRef = doc(db, CUSTOMERS_COLLECTION, id);
    await setDoc(docRef, updatedRecord, { merge: true });
    return id;
  } catch (error) {
    console.warn('Sync customer failed:', error);
    return null;
  }
}
