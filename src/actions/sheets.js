function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function deserializeHealthLog(row) {
  return {
    date: row.date,
    weight: row.weight || "",
    exercise: row.exercise === "true",
    meals: {
      pagi: safeJsonParse(row.meals_pagi, []),
      siang: safeJsonParse(row.meals_siang, []),
      sore: safeJsonParse(row.meals_sore, []),
    },
    score: parseInt(row.score) || 0,
    warnings: safeJsonParse(row.warnings, []),
  };
}

export function serializeHealthLog(entry) {
  return {
    date: entry.date,
    weight: entry.weight || "",
    exercise: entry.exercise ? "true" : "false",
    meals_pagi: JSON.stringify(entry.meals?.pagi || []),
    meals_siang: JSON.stringify(entry.meals?.siang || []),
    meals_sore: JSON.stringify(entry.meals?.sore || []),
    score: String(entry.score || 0),
    warnings: JSON.stringify(entry.warnings || []),
  };
}

export const groceryApi = {
  async getAll() {
    const res = await fetch("/api/sheets/grocery");
    if (!res.ok) throw new Error("Failed to fetch grocery data");
    return res.json();
  },

  async add(payload) {
    const res = await fetch("/api/sheets/grocery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", payload }),
    });
    return res.json();
  },

  async update(id, payload) {
    const res = await fetch("/api/sheets/grocery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", id, payload }),
    });
    return res.json();
  },

  async delete(id) {
    const res = await fetch("/api/sheets/grocery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    return res.json();
  },
};

export const healthApi = {
  async getAll() {
    const res = await fetch("/api/sheets/health");
    if (!res.ok) throw new Error("Failed to fetch health data");
    const rows = await res.json();
    return rows.map(deserializeHealthLog);
  },

  async upsert(entry) {
    const res = await fetch("/api/sheets/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upsert", payload: serializeHealthLog(entry) }),
    });
    return res.json();
  },
};
