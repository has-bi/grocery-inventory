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
 * After running, you'll see "Grocery", "Health", "Tasks", and "TaskLogs" tabs in your spreadsheet.
 */
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const SCHEMAS = {
    Grocery: ["_id", "nama", "kategori", "jumlah", "satuan", "tanggal_kadaluarsa", "lokasi"],
    Health: ["date", "weight", "exercise", "meals_pagi", "meals_siang", "meals_sore", "score", "warnings"],
    Tasks: ["_id", "title", "type", "category", "interval", "dayOfWeek", "deadline", "weight", "active", "lastDone", "createdAt"],
    TaskLogs: ["_id", "taskId", "completedDate"],
  };

  for (const [name, headers] of Object.entries(SCHEMAS)) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }

    const lastCol = sheet.getLastColumn();
    const existingHeaders = lastCol > 0
      ? sheet.getRange(1, 1, 1, lastCol).getValues()[0]
      : [];

    if (existingHeaders.length === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    } else {
      // Add any missing columns (e.g. lokasi added later)
      headers.forEach((h) => {
        if (!existingHeaders.includes(h)) {
          const nextCol = sheet.getLastColumn() + 1;
          sheet.getRange(1, nextCol).setValue(h);
          sheet.getRange(1, nextCol).setFontWeight("bold");
        }
      });
    }
  }

  Logger.log("Setup complete. Sheets created: Grocery, Health, Tasks, TaskLogs");
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
      case "upsertByName":
        return jsonResponse(upsertGroceryByName(payload));
      case "completeTask":
        return jsonResponse(completeTask(payload.taskId, payload.completedDate));
      case "uncompleteTask":
        return jsonResponse(uncompleteTask(payload.taskId, payload.completedDate));
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
  const tz = Session.getScriptTimeZone();
  return data.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      const val = row[i];
      obj[h] = val instanceof Date
        ? Utilities.formatDate(val, tz, "yyyy-MM-dd")
        : val;
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

  const tz = Session.getScriptTimeZone();
  for (let i = 1; i < data.length; i++) {
    const cellDate = data[i][dateCol] instanceof Date
      ? Utilities.formatDate(data[i][dateCol], tz, "yyyy-MM-dd")
      : String(data[i][dateCol]);
    if (cellDate === String(payload.date)) {
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

function upsertGroceryByName(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Grocery");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const namaCol = headers.indexOf("nama");

  const targetName = String(payload.nama || "").toLowerCase().trim();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][namaCol]).toLowerCase().trim() === targetName) {
      headers.forEach((h, j) => {
        if (payload[h] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(payload[h]);
        }
      });
      return { success: true, action: "updated" };
    }
  }

  return addRow("Grocery", payload);
}

function completeTask(taskId, completedDate) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const logsSheet = ss.getSheetByName("TaskLogs");
  logsSheet.appendRow([Utilities.getUuid(), taskId, completedDate]);

  const tasksSheet = ss.getSheetByName("Tasks");
  const data = tasksSheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("_id");
  const lastDoneCol = headers.indexOf("lastDone");
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(taskId)) {
      tasksSheet.getRange(i + 1, lastDoneCol + 1).setValue(completedDate);
      break;
    }
  }
  return { success: true };
}

function uncompleteTask(taskId, completedDate) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const logsSheet = ss.getSheetByName("TaskLogs");
  const logsData = logsSheet.getDataRange().getValues();
  const headers = logsData[0];
  const taskIdCol = headers.indexOf("taskId");
  const dateCol = headers.indexOf("completedDate");

  for (let i = logsData.length - 1; i >= 1; i--) {
    if (String(logsData[i][taskIdCol]) === String(taskId) &&
        String(logsData[i][dateCol]) === String(completedDate)) {
      logsSheet.deleteRow(i + 1);
      break;
    }
  }

  const remaining = logsSheet.getDataRange().getValues().slice(1)
    .filter(r => String(r[taskIdCol]) === String(taskId))
    .map(r => String(r[dateCol]))
    .filter(Boolean)
    .sort();
  const newLastDone = remaining.length > 0 ? remaining[remaining.length - 1] : "";
  updateRow("Tasks", taskId, { lastDone: newLastDone });
  return { success: true };
}

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
