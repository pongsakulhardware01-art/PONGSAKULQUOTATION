/**
 * แปลงจำนวนเงินตัวเลขเป็นข้อความภาษาไทย (Thai Baht Text)
 * เช่น 12345.50 -> "หนึ่งหมื่นสองพันสามร้อยสี่สิบห้าบาทห้าสิบสตางค์"
 * หรือ 500 -> "ห้าร้อยบาทถ้วน"
 */

const THAI_DIGITS = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const THAI_POSITIONS = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

function convertIntegerToThai(numStr: string): string {
  let result = '';
  const len = numStr.length;

  if (len > 7) {
    const millions = numStr.slice(0, len - 6);
    const remainder = numStr.slice(len - 6);
    return convertIntegerToThai(millions) + 'ล้าน' + convertIntegerToThai(remainder);
  }

  for (let i = 0; i < len; i++) {
    const digit = parseInt(numStr.charAt(i), 10);
    const pos = len - i - 1;

    if (digit !== 0) {
      if (pos === 0 && digit === 1 && len > 1 && parseInt(numStr.charAt(i - 1), 10) !== 0) {
        // เลข 1 ในหลักหน่วยเมื่อมีหลักอื่นนำหน้า
        result += 'เอ็ด';
      } else if (pos === 1 && digit === 1) {
        // 10 -> สิบ (ไม่ต้องมี "หนึ่ง")
        result += 'สิบ';
      } else if (pos === 1 && digit === 2) {
        // 20 -> ยี่สิบ
        result += 'ยี่สิบ';
      } else {
        result += THAI_DIGITS[digit] + THAI_POSITIONS[pos];
      }
    }
  }

  return result;
}

export function thaiBahtText(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'ศูนย์บาทถ้วน';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Round to 2 decimal places
  const fixed = absAmount.toFixed(2);
  const parts = fixed.split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  if (intPart === '0' && (decPart === '00' || !decPart)) {
    return 'ศูนย์บาทถ้วน';
  }

  let text = '';
  if (isNegative) {
    text += 'ลบ';
  }

  // แปลงจำนวนเต็ม
  if (intPart !== '0') {
    text += convertIntegerToThai(intPart) + 'บาท';
  }

  // แปลงเศษสตางค์
  if (decPart === '00' || !decPart) {
    text += 'ถ้วน';
  } else {
    // ถ้าไม่มีบาท แต่มีสตางค์
    if (intPart === '0') {
      text += convertIntegerToThai(decPart) + 'สตางค์';
    } else {
      text += convertIntegerToThai(decPart) + 'สตางค์';
    }
  }

  return text;
}
