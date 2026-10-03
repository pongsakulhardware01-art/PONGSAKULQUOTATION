/**
 * Application Version & Release Tracking
 * อัปเดตเวอร์ชันโปรแกรมและบันทึกประวัติการแก้ไข
 */

export interface VersionRelease {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export const APP_VERSION = '2.3.0';
export const APP_BUILD_DATE = '2026-10-03';

export const VERSION_HISTORY: VersionRelease[] = [
  {
    version: '2.3.0',
    date: '2026-10-03',
    title: 'Mobile-First Responsive UI & Overlap Fixes',
    highlights: [
      'แก้ไขปัญหาปุ่มและองค์ประกอบหน้าจอทับซ้อนกันบนมือถือและแท็บเล็ต',
      'ออกแบบหน้าจอแก้ไขให้ใช้งานบนมือถือได้อย่างลื่นไหล สะอาดตา ไม่ซับซ้อน',
      'ปรับเปลี่ยนรายการสินค้าบนมือถือเป็นการ์ดข้อมูลที่กรอกและปรับจำนวน/ราคาได้สะดวก',
      'เพิ่มแถบเมนูและปุ่มคำสั่งลัดสำหรับสมาร์ตโฟน (Mobile Quick Actions)',
      'จัดระเบียบส่วนหัว (Header) ให้ยืดหยุ่น ไม่ล้นหรือบีบอัดหน้าจอ',
    ],
  },
  {
    version: '2.2.0',
    date: '2026-10-03',
    title: 'Clean Minimal UI, On-Demand A4 Preview & Streamlined Export',
    highlights: [
      'จัดระเบียบหน้าจอให้สะอาดตา ไม่แออัด ซ่อนแถบพรีวิวเอกสารข้างจอตามคำขอของผู้ใช้',
      'เพิ่มหน้าต่างดูตัวอย่างเอกสาร A4 (Document Preview Modal) เรียกดูเมื่อต้องการได้ทุกเวลา',
      'จัดปุ่ม ดูตัวอย่าง, ส่งออก JPG (สำหรับส่ง LINE), และพิมพ์/บันทึก PDF ให้เข้าถึงได้ง่ายและชัดเจน',
      'ปรับขนาดตารางและแบบฟอร์มให้กว้างสบายตา พิมพ์ข้อมูลได้สะดวก รวดเร็ว และเป็นระเบียบ',
    ],
  },
  {
    version: '2.1.0',
    date: '2026-10-02',
    title: 'Cloud Multi-User, Auto Sequence, Ref Item Pull, Customer DB & Render Deploy',
    highlights: [
      'เชื่อมต่อระบบหลังบ้าน Cloud Firestore รองรับการทำงานพร้อมกันหลายผู้ใช้ (Multi-User)',
      'ระบบรันเลขที่ใบเสนอราคาอัตโนมัติ (Format: PKH-YYYYMM-XXXX) ไม่ซ้ำซ้อน',
      'ระบบดึงรายการและราคาเดิมเมื่อระบุเลขอ้างอิง (Reference Quote Item Import)',
      'ระบบบริหารจัดการฐานข้อมูลลูกค้า (Customer Database) พร้อมระบบช่วยแนะนำข้อมูลอัตโนมัติ',
      'รองรับการนำไปรันบน Render.com ทั้งแบบ Web Service (Node.js) และ Static Site',
      'ระบบแสดงเวอร์ชันโปรแกรมและบันทึกประวัติการอัปเดตทุกครั้งที่มีการแก้ไข',
    ],
  },
  {
    version: '2.0.0',
    date: '2026-09-30',
    title: 'High-Resolution JPG Export & Real Document Layout',
    highlights: [
      'ระบบสร้างและดาวน์โหลดภาพ JPG ความละเอียดสูงสำหรับส่งทาง LINE หรือแชต',
      'ปรับโครงสร้างหน้ากระดาษใบเสนอราคา A4 ให้ตรงตามเอกสารจริงของ บริษัท พงษ์สกุล ฮาร์ดแวร์ จำกัด',
      'เพิ่มคลังสินค้าสำเร็จรูป (Product Catalog) และการปรับแต่งรูปแบบการแสดงผล',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-09-01',
    title: 'Initial Quotation System Release',
    highlights: [
      'ระบบออกใบเสนอราคาเบื้องต้น คำนวณยอดเงิน ภาษีมูลค่าเพิ่ม และส่วนลด',
      'ระบบแปลงยอดเงินเป็นตัวอักษรภาษาไทย (BahtText)',
      'รองรับการสั่งพิมพ์และบันทึกเป็น PDF มาตรฐาน A4',
    ],
  },
];
