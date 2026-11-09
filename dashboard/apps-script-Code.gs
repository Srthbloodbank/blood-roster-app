/*** แดชบอร์ดผู้บริหาร — Apps Script backend ***
 * ใช้กับ Google Sheet เดิมของงานธนาคารเลือด
 * - เสิร์ฟหน้าแดชบอร์ด (ไฟล์ HTML ชื่อ "Dashboard")
 * - เก็บ/อ่านข้อมูล "ลงชื่ออยู่เวร" ในแท็บ "ลงชื่ออยู่เวร"
 *
 * วิธีใช้ (ย่อ):
 * 1) เปิด Google Sheet เดิม → เมนู ส่วนขยาย (Extensions) → Apps Script
 * 2) วางโค้ดนี้ในไฟล์ .gs และสร้างไฟล์ HTML ชื่อ "Dashboard" วางเนื้อหา index.html ลงไป
 * 3) Deploy → New deployment → ประเภท "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone with the link  (หัวหน้าเปิดได้โดยไม่ต้องล็อกอิน Google)
 * 4) ได้ลิงก์ .../exec → ส่งให้หัวหน้าได้เลย
 ********************************************************/

var TZ = 'Asia/Bangkok';
var ATT_SHEET = 'ลงชื่ออยู่เวร';
var ATT_HEADERS = ['วันที่', 'ชื่อ', 'ตำแหน่ง', 'เบอร์โทร', 'สถานะ', 'เวลา'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle('แดชบอร์ดผู้บริหาร')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function ss_() { return SpreadsheetApp.getActive(); }

function attSheet_() {
  var ss = ss_();
  var sh = ss.getSheetByName(ATT_SHEET);
  if (!sh) {
    sh = ss.insertSheet(ATT_SHEET);
    sh.getRange(1, 1, 1, ATT_HEADERS.length).setValues([ATT_HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function str_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, TZ, 'yyyy-MM-dd');
  return String(v == null ? '' : v).trim();
}

/** อ่านรายชื่อลงชื่ออยู่เวรของ "วันที่" ที่ขอ (dateKey = yyyy-MM-dd) */
function getAttendance(dateKey) {
  var sh = attSheet_(), last = sh.getLastRow();
  if (last < 2) return [];
  var rows = sh.getRange(2, 1, last - 1, ATT_HEADERS.length).getValues();
  var out = [];
  rows.forEach(function (r) {
    if (str_(r[0]) === String(dateKey)) {
      out.push({
        name: str_(r[1]), role: str_(r[2]), tel: str_(r[3]),
        status: str_(r[4]) || 'present', time: str_(r[5]) || '-'
      });
    }
  });
  return out;
}

/** บันทึกรายชื่อของ "วันที่" ที่ขอ (ลบของวันนั้นออกก่อน แล้วเขียนใหม่) */
function saveAttendance(dateKey, list) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = attSheet_(), last = sh.getLastRow();
    // ลบแถวของวันนั้นออกก่อน (ไล่จากล่างขึ้นบน)
    if (last >= 2) {
      var vals = sh.getRange(2, 1, last - 1, 1).getValues();
      for (var i = vals.length - 1; i >= 0; i--) {
        if (str_(vals[i][0]) === String(dateKey)) sh.deleteRow(i + 2);
      }
    }
    // เขียนใหม่
    var add = (list || []).map(function (a) {
      return [String(dateKey), str_(a.name), str_(a.role), str_(a.tel),
              str_(a.status) || 'present', str_(a.time) || '-'];
    });
    if (add.length) {
      sh.getRange(sh.getLastRow() + 1, 1, add.length, ATT_HEADERS.length)
        .setNumberFormat('@').setValues(add);
    }
    return { ok: true, count: add.length };
  } finally {
    lock.releaseLock();
  }
}
