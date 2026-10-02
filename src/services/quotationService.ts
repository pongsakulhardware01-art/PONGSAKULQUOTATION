import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { QuotationDocument } from '../types';

const QUOTATIONS_COLLECTION = 'quotations';

/**
 * Subscribes to real-time quotations list from Firestore
 */
export function subscribeQuotations(
  onData: (quotes: QuotationDocument[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(collection(db, QUOTATIONS_COLLECTION), orderBy('updatedAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const list: QuotationDocument[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as QuotationDocument;
        list.push({
          ...data,
          id: docSnap.id,
          isCloudSynced: true,
        });
      });
      onData(list);
    },
    (error) => {
      console.error('Error listening to quotations:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, QUOTATIONS_COLLECTION);
    }
  );

  return unsubscribe;
}

/**
 * Save or update quotation document to Cloud Firestore
 */
export async function saveQuotationToCloud(
  quote: QuotationDocument,
  userEmail?: string
): Promise<void> {
  const docId = quote.id || quote.quoteNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `${QUOTATIONS_COLLECTION}/${docId}`;

  const cleanPayload: QuotationDocument = {
    ...quote,
    id: docId,
    updatedAt: new Date().toISOString(),
    createdBy: quote.createdBy || userEmail || 'ทีมงานพงษ์สกุล ฮาร์ดแวร์',
    isCloudSynced: true,
  };

  try {
    const docRef = doc(db, QUOTATIONS_COLLECTION, docId);
    await setDoc(docRef, cleanPayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete quotation document from Firestore
 */
export async function deleteQuotationFromCloud(quoteId: string): Promise<void> {
  const path = `${QUOTATIONS_COLLECTION}/${quoteId}`;
  try {
    await deleteDoc(doc(db, QUOTATIONS_COLLECTION, quoteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Look up a prior quotation by its quotation number or reference number
 * Used for: การเรียกใบเสนอราคารายการ เมื่อใส่เลขอ้างอิง เพื่อดึงรายการและราคาเดิม
 */
export async function findQuotationByNumber(
  quoteNumber: string
): Promise<QuotationDocument | null> {
  const trimmed = quoteNumber.trim();
  if (!trimmed) return null;

  try {
    const q = query(
      collection(db, QUOTATIONS_COLLECTION),
      where('quoteNumber', '==', trimmed)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return {
        ...(docSnap.data() as QuotationDocument),
        id: docSnap.id,
      };
    }
    return null;
  } catch (error) {
    console.warn('Error querying quotation by number:', error);
    return null;
  }
}
