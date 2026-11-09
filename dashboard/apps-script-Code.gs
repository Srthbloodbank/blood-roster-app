/*** แดชบอร์ดผู้บริหาร — Apps Script backend (ดึงข้อมูลจริงจาก Google Sheets) ***
 *
 * ดึงข้อมูลจาก 3 ชีต:
 *   - ROSTER_ID : ชีตเวรแพทย์ (รายชื่อแพทย์ + ตารางออกหน่วย)
 *   - SUPPLY_ID : ชีตเบิกของ (records_app)
 *   - DASH_ID   : ชีตของแดชบอร์ดเอง (เก็บแท็บ "ลงชื่ออยู่เวร")
 *
 * วิธีเอาขึ้นใช้งาน:
 *  1) เปิดชีต DASH_ID → เมนู ส่วนขยาย (Extensions) → Apps Script
 *  2) วางโค้ดนี้ในไฟล์ .gs
 *  3) สร้างไฟล์ HTML ชื่อ "Dashboard" แล้ววางเนื้อหาไฟล์ index.html ลงไป
 *  4) Deploy → New deployment → Web app
 *       Execute as: Me   |   Who has access: Anyone with the link
 *  5) กด Authorize/อนุญาตสิทธิ์ (ครั้งแรกจะถามสิทธิ์เข้าถึงชีต) → ได้ลิงก์ .../exec ส่งให้หัวหน้าได้เลย
 ********************************************************/

var TZ = 'Asia/Bangkok';
var ROSTER_ID = '1MR-m4-5IEhpARB3BMZqJNRGAthM2xKqAKx5liKDwSyA';
var SUPPLY_ID = '14Q7ZFlmP7jv9NkVgnWFHdor6pfH2Q1Cc-LqdyN5foW8';
var DASH_ID   = '1kdDjVhxe9eheuTTEd87hXEcODFujkIZr0UZPLUHL8J0';

var ATT_SHEET = 'ลงชื่ออยู่เวร';
var ATT_HEADERS = ['วันที่', 'ชื่อ', 'ตำแหน่ง', 'เบอร์โทร', 'สถานะ', 'เวลา'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle('แดชบอร์ดผู้บริหาร')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function str_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, TZ, 'yyyy-MM-dd');
  return String(v == null ? '' : v).trim();
}
function list_(v) {
  return str_(v).split(/[\s,]+/).filter(function (x) { return x && x !== '-'; })
    .map(function (x) { return x.toUpperCase(); });
}

/** รวมข้อมูลทั้งหมดให้แดชบอร์ด (เรียกครั้งเดียว) */
function getBoardData(dateKey) {
  var out = { docs: [], events: [], supply: [], attendance: [] };

  // --- รายชื่อแพทย์ + ตารางออกหน่วย (ชีตเวรแพทย์) ---
  try {
    var rs = SpreadsheetApp.openById(ROSTER_ID);
    var docSh = rs.getSheetByName('แพทย์');
    if (docSh && docSh.getLastRow() > 1) {
      docSh.getRange(2, 1, docSh.getLastRow() - 1, 3).getValues().forEach(function (r) {
        if (str_(r[0])) out.docs.push({ code: str_(r[0]).toUpperCase(), name: str_(r[1]), tel: str_(r[2]) });
      });
    }
    var pmap = {};
    var placeSh = rs.getSheetByName('สถานที่');
    if (placeSh && placeSh.getLastRow() > 1) {
      placeSh.getRange(2, 1, placeSh.getLastRow() - 1, 2).getValues().forEach(function (r) {
        var n = parseInt(str_(r[0]), 10); if (n) pmap[n] = str_(r[1]);
      });
    }
    var planSh = rs.getSheetByName('แผน');
    if (planSh && planSh.getLastRow() > 1) {
      planSh.getRange(2, 1, planSh.getLastRow() - 1, 12).getValues().forEach(function (r) {
        var d = str_(r[0]); if (!d) return;
        var n = parseInt(str_(r[1]), 10) || 0;
        out.events.push({
          date: d, n: n, time: str_(r[2]) || '8.30 น.',
          codes: list_(r[3]), place: str_(r[5]) || pmap[n] || ''
        });
      });
    }
  } catch (e) { out.rosterError = String(e); }

  // --- ยอดเบิกของ (ชีตเบิกของ) ---
  try {
    var sp = SpreadsheetApp.openById(SUPPLY_ID).getSheetByName('records_app');
    if (sp && sp.getLastRow() > 1) {
      sp.getRange(2, 1, sp.getLastRow() - 1, 10).getValues().forEach(function (r) {
        if (!str_(r[0])) return;
        out.supply.push({
          date: str_(r[1]), place: str_(r[2]),
          donors: Number(r[3]) || 0, water: Number(r[4]) || 0,
          snack: Number(r[5]) || 0, rice: Number(r[6]) || 0
        });
      });
    }
  } catch (e) { out.supplyError = String(e); }

  // --- ลงชื่ออยู่เวรของวันนี้ ---
  try { out.attendance = getAttendance(dateKey); } catch (e) { out.attError = String(e); }

  return out;
}

/* ===== ลงชื่ออยู่เวร (เก็บในชีต DASH_ID) ===== */
function attSheet_() {
  var ss = SpreadsheetApp.openById(DASH_ID);
  var sh = ss.getSheetByName(ATT_SHEET);
  if (!sh) {
    sh = ss.insertSheet(ATT_SHEET);
    sh.getRange(1, 1, 1, ATT_HEADERS.length).setValues([ATT_HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}
function getAttendance(dateKey) {
  var sh = attSheet_(), last = sh.getLastRow();
  if (last < 2) return [];
  var out = [];
  sh.getRange(2, 1, last - 1, ATT_HEADERS.length).getValues().forEach(function (r) {
    if (str_(r[0]) === String(dateKey)) {
      out.push({ name: str_(r[1]), role: str_(r[2]), tel: str_(r[3]),
        status: str_(r[4]) || 'present', time: str_(r[5]) || '-' });
    }
  });
  return out;
}
function saveAttendance(dateKey, list) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = attSheet_(), last = sh.getLastRow();
    if (last >= 2) {
      var vals = sh.getRange(2, 1, last - 1, 1).getValues();
      for (var i = vals.length - 1; i >= 0; i--) {
        if (str_(vals[i][0]) === String(dateKey)) sh.deleteRow(i + 2);
      }
    }
    var add = (list || []).map(function (a) {
      return [String(dateKey), str_(a.name), str_(a.role), str_(a.tel),
        str_(a.status) || 'present', str_(a.time) || '-'];
    });
    if (add.length) {
      sh.getRange(sh.getLastRow() + 1, 1, add.length, ATT_HEADERS.length)
        .setNumberFormat('@').setValues(add);
    }
    return { ok: true, count: add.length };
  } finally { lock.releaseLock(); }
}
