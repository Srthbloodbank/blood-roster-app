// ===== Code.gs — HOMC Roster Backend =====

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var b = JSON.parse(e.postData.contents);
    if (b.action === 'saveRoster') return json_(saveRosterData(b.year, b.month, b.rows));
    if (b.action === 'saveStaff') return json_(saveStaffData(b.rows));
    return json_({ status: 'error', message: 'unknown action' });
  } catch (err) {
    return json_({ status: 'error', message: err.toString() });
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'get') {
    return json_(getRosterData(Number(e.parameter.year), Number(e.parameter.month)));
  }
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('ตารางเวร HOMC')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function setupInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetRoster = ss.getSheetByName("roster_2569_11");
  if (!sheetRoster) sheetRoster = ss.insertSheet("roster_2569_11");
  else sheetRoster.clear();

  const headers = ["วันที่","วัน","เวรเที่ยง","07.00-08.00 (1)","07.00-08.00 (2)","07.00-16.00","08.00-16.00","16.00-08.00"];
  const rosterData = [
    [1,"อาทิตย์","","","","อุษา","อัจฉราพรรณ","อัจฉราพรรณ"],
    [2,"จันทร์","อุษา","จิตรา","อภิสรา","","","จิตรา"],
    [3,"อังคาร","จิตรา","พรหมเทพ","ปัทมพร","","","ปัทมพร"],
    [4,"พุธ","พรหมเทพ","อภิสรา","อัจฉราพรรณ","","","พรหมเทพ"],
    [5,"พฤหัสบดี","อภิสรา","อุษา","ปัทมพร","","","อภิสรา"],
    [6,"ศุกร์","อัจฉราพรรณ","พรหมเทพ","อัจฉราพรรณ","","","อุษา"],
    [7,"เสาร์","SMC","","","พรหมเทพ","อัจฉราพรรณ","อัจฉราพรรณ"],
    [8,"อาทิตย์","","","","อภิสรา","ปัทมพร","ปัทมพร"],
    [9,"จันทร์","ปัทมพร","พรหมเทพ","อภิสรา","","","จิตรา"],
    [10,"อังคาร","อุษา","อัจฉราพรรณ","อภิสรา","","","พรหมเทพ"],
    [11,"พุธ","จิตรา","อุษา","ปัทมพร","","","อภิสรา"],
    [12,"พฤหัสบดี","พรหมเทพ","อุษา","จิตรา","","","อุษา"],
    [13,"ศุกร์","อภิสรา","จิตรา","พรหมเทพ","","","อัจฉราพรรณ"],
    [14,"เสาร์","","","","ปัทมพร","อุษา","อุษา"],
    [15,"อาทิตย์","","","","อัจฉราพรรณ","จิตรา","จิตรา"],
    [16,"จันทร์","อัจฉราพรรณ","อัจฉราพรรณ","ปัทมพร","","","พรหมเทพ"],
    [17,"อังคาร","ปัทมพร","อุษา","ปัทมพร","","","อภิสรา"],
    [18,"พุธ","อุษา","อุษา","อัจฉราพรรณ","","","ปัทมพร"],
    [19,"พฤหัสบดี","จิตรา","จิตรา","พรหมเทพ","","","อัจฉราพรรณ"],
    [20,"ศุกร์","พรหมเทพ","จิตรา","อภิสรา","","","อุษา"],
    [21,"เสาร์","SMC","","","อัจฉราพรรณ","จิตรา","จิตรา"],
    [22,"อาทิตย์","","","","ปัทมพร","พรหมเทพ","พรหมเทพ"],
    [23,"จันทร์","อภิสรา","อัจฉราพรรณ","ปัทมพร","","","อภิสรา"],
    [24,"อังคาร","อัจฉราพรรณ","อุษา","จิตรา","","","ปัทมพร"],
    [25,"พุธ","ปัทมพร","อุษา","พรหมเทพ","","","อัจฉราพรรณ"],
    [26,"พฤหัสบดี","อุษา","พรหมเทพ","อภิสรา","","","อุษา"],
    [27,"ศุกร์","จิตรา","อภิสรา","ปัทมพร","","","จิตรา"],
    [28,"เสาร์","","","","ปัทมพร","พรหมเทพ","พรหมเทพ"],
    [29,"อาทิตย์","","","","จิตรา","อภิสรา","อภิสรา"],
    [30,"จันทร์","พรหมเทพ","จิตรา","อัจฉราพรรณ","","","ปัทมพร"]
  ];
  sheetRoster.appendRow(headers);
  sheetRoster.getRange(2, 1, rosterData.length, headers.length).setValues(rosterData);

  let sheetStaff = ss.getSheetByName("staff_list");
  if (!sheetStaff) sheetStaff = ss.insertSheet("staff_list");
  else sheetStaff.clear();
  sheetStaff.appendRow(["ลำดับ","ชื่อ-นามสกุล","สถานะ"]);
  const staffList = [
    [1,"อุษา","ใช้งาน"],
    [2,"จิตรา","ใช้งาน"],
    [3,"พรหมเทพ","ใช้งาน"],
    [4,"อภิสรา","ใช้งาน"],
    [5,"ปัทมพร","ใช้งาน"],
    [6,"อัจฉราพรรณ","ใช้งาน"]
  ];
  sheetStaff.getRange(2, 1, staffList.length, 3).setValues(staffList);
}

function getRosterData(year, month) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = `roster_${year}_${month}`;
    let sheetRoster = ss.getSheetByName(sheetName);
    let sheetStaff = ss.getSheetByName("staff_list");

    if (!sheetStaff) {
      setupInitialData();
      sheetStaff = ss.getSheetByName("staff_list");
      sheetRoster = ss.getSheetByName("roster_2569_11");
    }

    if (!sheetRoster) {
      sheetRoster = ss.insertSheet(sheetName);
      const headers = ["วันที่","วัน","เวรเที่ยง","07.00-08.00 (1)","07.00-08.00 (2)","07.00-16.00","08.00-16.00","16.00-08.00"];
      sheetRoster.appendRow(headers);
      const daysInMonth = new Date(year - 543, month, 0).getDate();
      const dnNames = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
      const startDayOfWeek = new Date(year - 543, month - 1, 1).getDay();
      const emptyData = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const wIdx = (startDayOfWeek + d - 1) % 7;
        emptyData.push([d, dnNames[wIdx], "", "", "", "", "", ""]);
      }
      sheetRoster.getRange(2, 1, emptyData.length, headers.length).setValues(emptyData);
    }

    const rosterValues = sheetRoster.getDataRange().getValues();
    rosterValues.shift();
    const staffValues = sheetStaff.getDataRange().getValues();
    staffValues.shift();

    return { status: "success", roster: rosterValues, staffRaw: staffValues };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}

function saveRosterData(year, month, newRoster) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = `roster_${year}_${month}`;
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);
    sheet.clear();
    const headers = ["วันที่","วัน","เวรเที่ยง","07.00-08.00 (1)","07.00-08.00 (2)","07.00-16.00","08.00-16.00","16.00-08.00"];
    sheet.appendRow(headers);
    if (newRoster && newRoster.length > 0) {
      sheet.getRange(2, 1, newRoster.length, newRoster[0].length).setValues(newRoster);
    }
    return { status: "success", message: "บันทึกตารางเวรสำเร็จ" };
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
}

function saveStaffData(newStaffList) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("staff_list");
    if (!sheet) sheet = ss.insertSheet("staff_list");
    sheet.clear();
    sheet.appendRow(["ลำดับ","ชื่อ-นามสกุล","สถานะ"]);
    if (newStaffList && newStaffList.length > 0) {
      sheet.getRange(2, 1, newStaffList.length, 3).setValues(newStaffList);
    }
    return { status: "success", message: "บันทึกรายชื่อเจ้าหน้าที่สำเร็จ" };
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
}
