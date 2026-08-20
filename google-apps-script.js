/**
 * Latihan — Google Apps Script Web App
 *
 * Setup:
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Paste this entire file, replacing what's there
 * 3. Click Run → setupSheets() once to create tabs + headers
 * 4. Click Run → seedExercises() once to populate master exercise list
 * 5. Click Run → seedPrograms() once to populate default Upper/Lower program
 * 6. Deploy → New deployment → Web app (Execute as: Me, Who: Anyone)
 * 7. Copy Web App URL → set as APPS_SCRIPT_URL in Vercel env vars
 */

const SPREADSHEET_ID = "1KeDvjqh_vf73zVw7xKlCAuAQYuXI-QKzsfOPrVkbYqk";

function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const SCHEMAS = {
    BodyMetrics: ["_id", "date", "weight", "waist", "height", "bmi"],
    Exercises:   ["_id", "name", "muscle_group", "equipment"],
    WorkoutLogs: ["_id", "date", "session", "exercise_name", "set_number", "weight", "reps", "rpe", "notes"],
    Programs:    ["_id", "session", "exercise_name", "target_sets", "target_reps", "rest_seconds", "target_weight", "sort_order"],
  };

  for (const [name, headers] of Object.entries(SCHEMAS)) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);

    const lastCol = sheet.getLastColumn();
    const existingHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

    if (existingHeaders.length === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    } else {
      headers.forEach((h) => {
        if (!existingHeaders.includes(h)) {
          const nextCol = sheet.getLastColumn() + 1;
          sheet.getRange(1, nextCol).setValue(h);
          sheet.getRange(1, nextCol).setFontWeight("bold");
        }
      });
    }
  }

  Logger.log("Setup complete: BodyMetrics, Exercises, WorkoutLogs, Programs");
}

function seedExercises() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Exercises");
  if (sheet.getLastRow() > 1) {
    Logger.log("Exercises sheet already has data — skipping seed.");
    return;
  }

  const exercises = [
    ["Bench Press",          "Dada",              "Barbell"],
    ["Incline Bench Press",  "Dada",              "Barbell"],
    ["Incline DB Press",     "Dada",              "Dumbbell"],
    ["Cable Fly",            "Dada",              "Cable"],
    ["Bent Over Row",        "Punggung",          "Barbell"],
    ["Lat Pulldown",         "Punggung",          "Cable"],
    ["Seated Cable Row",     "Punggung",          "Cable"],
    ["Pull Up",              "Punggung",          "Bodyweight"],
    ["Overhead Press",       "Bahu",              "Barbell"],
    ["Lateral Raise",        "Bahu",              "Dumbbell"],
    ["Face Pull",            "Bahu",              "Cable"],
    ["Bicep Curl",           "Bisep",             "Dumbbell"],
    ["Hammer Curl",          "Bisep",             "Dumbbell"],
    ["Tricep Pushdown",      "Trisep",            "Cable"],
    ["Skull Crusher",        "Trisep",            "Barbell"],
    ["Squat",                "Quadrisep",         "Barbell"],
    ["Romanian Deadlift",    "Hamstring",         "Barbell"],
    ["Deadlift",             "Posterior Chain",   "Barbell"],
    ["Leg Press",            "Quadrisep",         "Machine"],
    ["Leg Curl",             "Hamstring",         "Machine"],
    ["Leg Extension",        "Quadrisep",         "Machine"],
    ["Hip Thrust",           "Glutes",            "Barbell"],
    ["Walking Lunge",        "Quadrisep",         "Dumbbell"],
    ["Calf Raise",           "Betis",             "Machine"],
    ["Treadmill",            "Kardio",            "Machine"],
    ["Stationary Bike",      "Kardio",            "Machine"],
    ["Rowing Machine",       "Kardio",            "Machine"],
  ];

  exercises.forEach(([name, muscle_group, equipment]) => {
    sheet.appendRow([Utilities.getUuid(), name, muscle_group, equipment]);
  });

  Logger.log("Seeded " + exercises.length + " exercises.");
}

function seedPrograms() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Programs");
  if (sheet.getLastRow() > 1) {
    Logger.log("Programs sheet already has data — skipping seed.");
    return;
  }

  const programs = [
    ["Upper A", "Bench Press",          4, "8-12", 90,  60,  1],
    ["Upper A", "Incline DB Press",     3, "10-12", 90, 20,  2],
    ["Upper A", "Lat Pulldown",         4, "8-12", 90,  50,  3],
    ["Upper A", "Seated Cable Row",     3, "10-12", 90, 50,  4],
    ["Upper A", "Overhead Press",       3, "8-10", 90,  40,  5],
    ["Upper A", "Bicep Curl",           3, "12",   60,  12,  6],
    ["Upper A", "Tricep Pushdown",      3, "12",   60,  20,  7],
    ["Lower A", "Squat",                4, "6-10", 120, 60,  1],
    ["Lower A", "Romanian Deadlift",    3, "8-12", 90,  60,  2],
    ["Lower A", "Leg Press",            3, "10-15", 90, 80,  3],
    ["Lower A", "Leg Curl",             3, "10-12", 60, 30,  4],
    ["Lower A", "Calf Raise",           4, "15-20", 45, 40,  5],
    ["Upper B", "Incline Bench Press",  4, "8-12", 90,  50,  1],
    ["Upper B", "Cable Fly",            3, "12-15", 60, 15,  2],
    ["Upper B", "Bent Over Row",        4, "6-10", 90,  60,  3],
    ["Upper B", "Pull Up",              3, "AMRAP", 90,  0,  4],
    ["Upper B", "Lateral Raise",        3, "15",   60,   8,  5],
    ["Upper B", "Hammer Curl",          3, "12",   60,  12,  6],
    ["Upper B", "Skull Crusher",        3, "12",   60,  20,  7],
    ["Lower B", "Deadlift",             4, "4-6",  180, 80,  1],
    ["Lower B", "Leg Press",            3, "10-15", 90, 80,  2],
    ["Lower B", "Walking Lunge",        3, "12",   90,  10,  3],
    ["Lower B", "Leg Extension",        3, "12-15", 60, 30,  4],
    ["Lower B", "Hip Thrust",           3, "10-15", 90, 40,  5],
    ["Kondisioning", "Treadmill",          1, "30 min", 0, 0, 1],
    ["Kondisioning", "Stationary Bike",    1, "20 min", 0, 0, 2],
  ];

  programs.forEach(([session, exercise_name, target_sets, target_reps, rest_seconds, target_weight, sort_order]) => {
    sheet.appendRow([Utilities.getUuid(), session, exercise_name, target_sets, target_reps, rest_seconds, target_weight, sort_order]);
  });

  Logger.log("Seeded " + programs.length + " program entries.");
}

function doGet(e) {
  try {
    const { action, sheet: sheetName } = e.parameter;
    if (action === "getAll") return jsonResponse(getAllRows(sheetName));
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
      case "add":    return jsonResponse(addRow(sheetName, payload));
      case "update": return jsonResponse(updateRow(sheetName, id, payload));
      case "delete": return jsonResponse(deleteRow(sheetName, id));
      default:       return jsonResponse({ error: "Unknown action" });
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
      obj[h] = val instanceof Date ? Utilities.formatDate(val, tz, "yyyy-MM-dd") : val;
    });
    return obj;
  });
}

function addRow(sheetName, payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const id = Utilities.getUuid();
  const row = headers.map((h) => (h === "_id" ? id : payload[h] !== undefined ? payload[h] : ""));

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

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
