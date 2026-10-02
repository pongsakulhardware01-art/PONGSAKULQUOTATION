import { doc, runTransaction, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { QuotationDocument } from '../types';

/**
 * Generates quotation prefix based on current date e.g. "PKH-202610-"
 */
export function getCurrentQuotationPrefix(customPrefix = 'PKH'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${customPrefix}-${year}${month}-`;
}

/**
 * Calculate the next quotation number from an in-memory list of quotations
 */
export function calculateNextNumberFromList(
  quotes: QuotationDocument[],
  customPrefix = 'PKH'
): string {
  const prefix = getCurrentQuotationPrefix(customPrefix);
  let highestNum = 0;

  for (const q of quotes) {
    if (q.quoteNumber && q.quoteNumber.startsWith(prefix)) {
      const suffix = q.quoteNumber.slice(prefix.length);
      const parsed = parseInt(suffix, 10);
      if (!isNaN(parsed) && parsed > highestNum) {
        highestNum = parsed;
      }
    }
  }

  const nextNum = highestNum + 1;
  return `${prefix}${String(nextNum).padStart(4, '0')}`;
}

/**
 * Atomically reserve and retrieve the next quotation number from Firestore
 */
export async function getNextQuotationNumberFromCloud(
  customPrefix = 'PKH',
  localQuotesFallback: QuotationDocument[] = []
): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}${month}`;
  const counterDocId = `${customPrefix}-${monthKey}`;
  const prefix = `${customPrefix}-${monthKey}-`;

  const counterRef = doc(db, 'counters', counterDocId);

  try {
    const nextSeq = await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      let currentVal = 0;

      if (counterSnap.exists()) {
        currentVal = counterSnap.data().currentNumber || 0;
      } else {
        // Find highest existing in local quotes for this month to seed the counter
        for (const q of localQuotesFallback) {
          if (q.quoteNumber && q.quoteNumber.startsWith(prefix)) {
            const suffix = q.quoteNumber.slice(prefix.length);
            const num = parseInt(suffix, 10);
            if (!isNaN(num) && num > currentVal) {
              currentVal = num;
            }
          }
        }
      }

      const nextVal = currentVal + 1;
      transaction.set(
        counterRef,
        {
          prefix,
          currentNumber: nextVal,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      return nextVal;
    });

    return `${prefix}${String(nextSeq).padStart(4, '0')}`;
  } catch (error) {
    console.warn('Failed to fetch sequence from Cloud counter, using list calculation fallback:', error);
    return calculateNextNumberFromList(localQuotesFallback, customPrefix);
  }
}
