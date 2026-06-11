/**
 * BarangXLupa — Google Apps Script Web App
 *
 * Setup:
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Paste this entire file, replacing what's there
 * 3. The SPREADSHEET_ID is already filled in below
 * 4. Click Run → setupSheets() once to create tabs + headers
 * 5. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL → set as APPS_SCRIPT_URL in Vercel env vars
 */

const SPREADSHEET_ID = "1KeDvjqh_vf73zVw7xKlCAuAQYuXI-QKzsfOPrVkbYqk";

/**
 * Run this ONCE from the Apps Script editor to create both sheets with correct headers.
 * After running, you'll see "Grocery" and "Health" tabs in your spreadsheet.
 */
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const SHEETS = {
    Grocery: ["_id", "nama", "kategori", "jumlah", "satuan", "tanggal_kadaluarsa"],
    Health: ["date", "weight", "exercise", "meals_pagi", "meals_siang", "meals_sore", "score", "warnings"],
  };

  for (const [name, headers] of Object.entries(SHEETS)) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    // Only write headers if row 1 is empty
    if (sheet.getRange(1, 1).getValue() === "") {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  }

  Logger.log("Setup complete. Sheets created: Grocery, Health");
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const sheetName = e.parameter.sheet;

    if (action === "getAll") {
      return jsonResponse(getAllRows(sheetName));
    }

    return jsonResponse({ error: "Unknown action" });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { action, sheet: sheetName, payload, id } = data;

    switch (action) {
      case "add":
        return jsonResponse(addRow(sheetName, payload));
      case "update":
        return jsonResponse(updateRow(sheetName, id, payload));
      case "delete":
        return jsonResponse(deleteRow(sheetName, id));
      case "upsert":
        return jsonResponse(upsertHealthRow(payload));
      default:
        return jsonResponse({ error: "Unknown action" });
    }
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function getAllRows(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  return data.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
}

function addRow(sheetName, payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const id = Utilities.getUuid();
  const row = headers.map((h) => {
    if (h === "_id") return id;
    return payload[h] !== undefined ? payload[h] : "";
  });

  sheet.appendRow(row);
  return { success: true, _id: id };
}

function updateRow(sheetName, id, payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("_id");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(id)) {
      headers.forEach((h, j) => {
        if (h !== "_id" && payload[h] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(payload[h]);
        }
      });
      return { success: true };
    }
  }

  return { success: false, error: "Row not found" };
}

function deleteRow(sheetName, id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("_id");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }

  return { success: false, error: "Row not found" };
}

function upsertHealthRow(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Health");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const dateCol = headers.indexOf("date");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][dateCol]) === String(payload.date)) {
      headers.forEach((h, j) => {
        if (payload[h] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(payload[h]);
        }
      });
      return { success: true };
    }
  }

  const row = headers.map((h) => (payload[h] !== undefined ? payload[h] : ""));
  sheet.appendRow(row);
  return { success: true };
}

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
