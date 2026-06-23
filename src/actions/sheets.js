function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function deserializeHealthLog(row) {
  return {
    date: row.date ? String(row.date).slice(0, 10) : "",
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

  async upsertByName(payload) {
    const res = await fetch("/api/sheets/grocery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upsertByName", payload }),
    });
    return res.json();
  },
};

function deserializeTask(row) {
  return {
    ...row,
    active: String(row.active) === "true",
    lastDone: row.lastDone ? String(row.lastDone).slice(0, 10) : "",
    deadline: row.deadline ? String(row.deadline).slice(0, 10) : "",
    createdAt: row.createdAt ? String(row.createdAt).slice(0, 10) : "",
    dayOfWeek: row.dayOfWeek || "[]",
    interval: row.interval ? String(row.interval) : "",
  };
}

function deserializeTaskLog(row) {
  return {
    ...row,
    completedDate: row.completedDate ? String(row.completedDate).slice(0, 10) : "",
  };
}

export const tasksApi = {
  async getAll() {
    const res = await fetch("/api/sheets/tasks");
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const rows = await res.json();
    return rows.map(deserializeTask);
  },

  async getLogs() {
    const res = await fetch("/api/sheets/tasks?type=logs");
    if (!res.ok) throw new Error("Failed to fetch task logs");
    const rows = await res.json();
    return rows.map(deserializeTaskLog);
  },

  async add(payload) {
    const res = await fetch("/api/sheets/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", sheet: "Tasks", payload }),
    });
    return res.json();
  },

  async update(id, payload) {
    const res = await fetch("/api/sheets/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", sheet: "Tasks", id, payload }),
    });
    return res.json();
  },

  async delete(id) {
    const res = await fetch("/api/sheets/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", sheet: "Tasks", id }),
    });
    return res.json();
  },

  async complete(taskId, completedDate) {
    const res = await fetch("/api/sheets/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "completeTask", payload: { taskId, completedDate } }),
    });
    return res.json();
  },

  async uncomplete(taskId, completedDate) {
    const res = await fetch("/api/sheets/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "uncompleteTask", payload: { taskId, completedDate } }),
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
