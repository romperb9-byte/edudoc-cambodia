/**
 * =========================================================================
 * GOOGLE APPS SCRIPT BACKEND CODE (Code.gs)
 * ប្រព័ន្ធគ្រប់គ្រងសៀវភៅចុះលិខិតចេញ និងសៀវភៅចុះលិខិតចូល
 * សម្រាប់ស្ថាប័នអប់រំកម្ពុជា
 * =========================================================================
 * 
 * របៀបដំឡើង (Setup Instructions):
 * 1. បង្កើត Google Sheet ថ្មីមួយលើ Google Drive របស់អ្នក។
 * 2. ចូលទៅ Extensions -> Apps Script
 * 3. Copy កូដទាំងអស់ក្នុង file នេះ ទៅបិទភ្ជាប់ក្នុង Code.gs
 * 4. ចុច Deploy -> New deployment -> Select type: Web App
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone
 * 5. ចុច Deploy ហើយ Copy យក "Web App URL" មកដាក់ក្នុង Settings នៃ Web Application នេះ!
 */

const OUTGOING_SHEET = "OutgoingLetters";
const INCOMING_SHEET = "IncomingLetters";
const SETTINGS_SHEET = "Settings";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    initSheets();
    
    let action = "";
    let payload = {};

    if (e.parameter && e.parameter.action) {
      action = e.parameter.action;
    }
    
    if (e.postData && e.postData.contents) {
      try {
        const body = JSON.parse(e.postData.contents);
        if (body.action) action = body.action;
        payload = body.data || body;
      } catch (err) {
        // Form encoded or plain
      }
    }

    let responseData = { status: "success" };

    switch (action) {
      case "getAllData":
        responseData.data = {
          outgoing: getSheetRecords(OUTGOING_SHEET),
          incoming: getSheetRecords(INCOMING_SHEET),
          settings: getSettings()
        };
        break;

      case "getOutgoing":
        responseData.data = getSheetRecords(OUTGOING_SHEET);
        break;

      case "getIncoming":
        responseData.data = getSheetRecords(INCOMING_SHEET);
        break;

      case "saveOutgoing":
        responseData.data = saveRecord(OUTGOING_SHEET, payload);
        break;

      case "saveIncoming":
        responseData.data = saveRecord(INCOMING_SHEET, payload);
        break;

      case "deleteOutgoing":
        deleteRecord(OUTGOING_SHEET, payload.id || e.parameter.id);
        break;

      case "deleteIncoming":
        deleteRecord(INCOMING_SHEET, payload.id || e.parameter.id);
        break;

      case "saveSettings":
        saveSettings(payload);
        break;

      default:
        responseData = {
          status: "success",
          message: "Education Registry API Ready. Use ?action=getAllData to fetch data."
        };
    }

    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * បង្កើត Header Sheets ប្រសិនបើមិនទាន់មាន
 */
function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Outgoing Sheet
  let outSheet = ss.getSheetByName(OUTGOING_SHEET);
  if (!outSheet) {
    outSheet = ss.insertSheet(OUTGOING_SHEET);
    const headers = ["ID", "លេខរៀង", "ខ្លឹមសារ", "ថ្ងៃ", "ខែ", "ឆ្នាំ", "ចំនួន", "ក្រសួងទទួល", "សេចក្ដីផ្សេងៗ", "ឯកសារភ្ជាប់", "CreatedAt"];
    outSheet.appendRow(headers);
    outSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e8f0fe");
    outSheet.setFrozenRows(1);
  } else {
    // Auto-migrate: check if ឯកសារភ្ជាប់ column exists
    const headers = outSheet.getRange(1, 1, 1, outSheet.getLastColumn() || 1).getValues()[0];
    if (headers.indexOf("ឯកសារភ្ជាប់") === -1) {
      outSheet.getRange(1, headers.length + 1).setValue("ឯកសារភ្ជាប់").setFontWeight("bold");
    }
  }

  // Incoming Sheet
  let inSheet = ss.getSheetByName(INCOMING_SHEET);
  if (!inSheet) {
    inSheet = ss.insertSheet(INCOMING_SHEET);
    const headers = ["ID", "លេខរៀង", "ខ្លឹមសារ", "ក្រសួងដើម", "ចំនួន", "លេខលិខិតដើម", "ថ្ងៃ", "ខែ", "ឆ្នាំ", "សេចក្ដីផ្សេងៗ", "ឯកសារភ្ជាប់", "CreatedAt"];
    inSheet.appendRow(headers);
    inSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e8f0fe");
    inSheet.setFrozenRows(1);
  } else {
    // Auto-migrate: check if ឯកសារភ្ជាប់ column exists
    const headers = inSheet.getRange(1, 1, 1, inSheet.getLastColumn() || 1).getValues()[0];
    if (headers.indexOf("ឯកសារភ្ជាប់") === -1) {
      inSheet.getRange(1, headers.length + 1).setValue("ឯកសារភ្ជាប់").setFontWeight("bold");
    }
  }

  // Settings Sheet
  let setSheet = ss.getSheetByName(SETTINGS_SHEET);
  if (!setSheet) {
    setSheet = ss.insertSheet(SETTINGS_SHEET);
    setSheet.appendRow(["Key", "Value"]);
    setSheet.getRange(1, 1, 1, 2).setFontWeight("bold");
    setSheet.setFrozenRows(1);
  }
}

function getSheetRecords(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const records = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] && !row[1]) continue; // Skip empty rows
    const item = {};
    for (let c = 0; c < headers.length; c++) {
      item[headers[c]] = row[c] !== undefined ? row[c].toString() : "";
    }
    records.push(item);
  }
  return records;
}

function saveRecord(sheetName, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const id = data.ID || data.id || Utilities.getUuid();
  data.ID = id;
  if (!data.CreatedAt) {
    data.CreatedAt = new Date().toISOString();
  }

  let existingRowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == id) {
      existingRowIndex = i + 1; // 1-indexed for Sheet
      break;
    }
  }

  const rowValues = headers.map(h => {
    return data[h] !== undefined ? data[h] : "";
  });

  if (existingRowIndex > 0) {
    sheet.getRange(existingRowIndex, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return data;
}

function deleteRecord(sheetName, id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function getSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SETTINGS_SHEET);
  if (!sheet) return {};
  const rows = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0]) {
      settings[rows[i][0]] = rows[i][1];
    }
  }
  return settings;
}

function saveSettings(settingsObj) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SETTINGS_SHEET);
  sheet.clear();
  sheet.appendRow(["Key", "Value"]);
  sheet.getRange(1, 1, 1, 2).setFontWeight("bold");
  sheet.setFrozenRows(1);
  for (let key in settingsObj) {
    sheet.appendRow([key, settingsObj[key]]);
  }
  return true;
}
