/*** Supply BB — Web App backend (Google Apps Script) ***
 * เชื่อมเว็บ "เบิกของออกหน่วย" กับ Google Sheet
 * - เก็บรายการเบิกลงชีต "Supply BB" (แท็บ records_app)
 * - อ่านรายชื่อหน่วย + แผนเวรแพทย์ จากชีตเวรแพทย์ (อ่านอย่างเดียว)
 ********************************************************/

var SUPPLY_ID = '14Q7ZFlmP7jv9NkVgnWFHdor6pfH2Q1Cc-LqdyN5foW8';   // ชีต Supply BB
var ROSTER_ID = '1MR-m4-5IEhpARB3BMZqJNRGAthM2xKqAKx5liKDwSyA';   // ชีตเวรแพทย์
var REC_SHEET = 'records_app';
var HEADERS = ['id','date','place','donors','water','snack','rice','note','createdAt','updatedAt'];

function recSheet_() {
  var ss = SpreadsheetApp.openById(SUPPLY_ID);
  var sh = ss.getSheetByName(REC_SHEET);
  if (!sh) { sh = ss.insertSheet(REC_SHEET); sh.appendRow(HEADERS); }
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

function readRecords_() {
  var sh = recSheet_(), vals = sh.getDataRange().getValues(), out = [];
  for (var i = 1; i < vals.length; i++) {
    var r = vals[i]; if (!r[0]) continue;
    out.push({ id:String(r[0]), date:String(r[1]), place:String(r[2]),
      donors:Number(r[3])||0, water:Number(r[4])||0, snack:Number(r[5])||0, rice:Number(r[6])||0,
      note:String(r[7]||''), createdAt:String(r[8]||''), updatedAt:String(r[9]||'') });
  }
  return out;
}

function readUnits_() {
  try {
    var sh = SpreadsheetApp.openById(ROSTER_ID).getSheetByName('สถานที่');
    var last = sh.getLastRow(); if (last < 2) return [];
    var vals = sh.getRange(2, 2, last - 1, 1).getValues(), out = [];
    vals.forEach(function (v) { if (v[0]) out.push(String(v[0])); });
    return out;
  } catch (e) { return []; }
}

function readPlan_() {
  try {
    var sh = SpreadsheetApp.openById(ROSTER_ID).getSheetByName('แผน');
    var vals = sh.getDataRange().getValues(), plan = {};
    for (var i = 1; i < vals.length; i++) {
      var iso = toISO_(vals[i][0]), place = vals[i][5];
      if (iso && place) plan[iso] = String(place);
    }
    return plan;
  } catch (e) { return {}; }
}

function toISO_(d) {
  if (d instanceof Date) return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var s = String(d), m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? (m[1] + '-' + m[2] + '-' + m[3]) : '';
}

function doGet(e) {
  return out_(e, { ok:true, records:readRecords_(), units:readUnits_(), plan:readPlan_() });
}

function doPost(e) {
  var res = { ok:false };
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var sh = recSheet_(), now = new Date().toISOString();
    if (body.action === 'save' && body.record) {
      var rec = body.record, vals = sh.getDataRange().getValues(), rowIdx = -1;
      for (var i = 1; i < vals.length; i++) { if (String(vals[i][0]) === String(rec.id)) { rowIdx = i + 1; break; } }
      var row = [rec.id, rec.date||'', rec.place||'', Number(rec.donors)||0, Number(rec.water)||0,
        Number(rec.snack)||0, Number(rec.rice)||0, rec.note||'', rec.createdAt||now, now];
      if (rowIdx > 0) sh.getRange(rowIdx, 1, 1, HEADERS.length).setValues([row]);
      else sh.appendRow(row);
      res = { ok:true };
    } else if (body.action === 'delete' && body.id) {
      var v2 = sh.getDataRange().getValues();
      for (var j = v2.length - 1; j >= 1; j--) { if (String(v2[j][0]) === String(body.id)) sh.deleteRow(j + 1); }
      res = { ok:true };
    }
  } catch (err) { res = { ok:false, error:String(err) }; }
  return out_(e, res);
}

function out_(e, data) {
  var json = JSON.stringify(data), cb = e && e.parameter && e.parameter.callback;
  if (cb) return ContentService.createTextOutput(cb + '(' + json + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
