function deserializeBodyMetric(row) {
  return {
    ...row,
    weight: parseFloat(row.weight) || 0,
    waist: parseFloat(row.waist) || 0,
    height: parseFloat(row.height) || 173,
    bmi: parseFloat(row.bmi) || 0,
    date: row.date ? String(row.date).slice(0, 10) : "",
  };
}

function deserializeWorkoutLog(row) {
  return {
    ...row,
    weight: parseFloat(row.weight) || 0,
    reps: parseInt(row.reps) || 0,
    rpe: parseInt(row.rpe) || 0,
    set_number: parseInt(row.set_number) || 0,
    date: row.date ? String(row.date).slice(0, 10) : "",
  };
}

function deserializeProgram(row) {
  return {
    ...row,
    target_sets: parseInt(row.target_sets) || 0,
    rest_seconds: parseInt(row.rest_seconds) || 0,
    target_weight: parseFloat(row.target_weight) || 0,
    sort_order: parseInt(row.sort_order) || 0,
  };
}

export const bodyApi = {
  async getAll() {
    const res = await fetch("/api/sheets/body");
    if (!res.ok) throw new Error("Failed to fetch body metrics");
    const rows = await res.json();
    return rows.map(deserializeBodyMetric);
  },
  async add(payload) {
    const res = await fetch("/api/sheets/body", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", payload }),
    });
    return res.json();
  },
  async delete(id) {
    const res = await fetch("/api/sheets/body", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    return res.json();
  },
};

export const exercisesApi = {
  async getAll() {
    const res = await fetch("/api/sheets/exercises");
    if (!res.ok) throw new Error("Failed to fetch exercises");
    return res.json();
  },
  async add(payload) {
    const res = await fetch("/api/sheets/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", payload }),
    });
    return res.json();
  },
};

export const workoutApi = {
  async getAll() {
    const res = await fetch("/api/sheets/workout");
    if (!res.ok) throw new Error("Failed to fetch workout logs");
    const rows = await res.json();
    return rows.map(deserializeWorkoutLog);
  },
  async add(payload) {
    const res = await fetch("/api/sheets/workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", payload }),
    });
    return res.json();
  },
  async delete(id) {
    const res = await fetch("/api/sheets/workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    return res.json();
  },
};

export const programApi = {
  async getAll() {
    const res = await fetch("/api/sheets/program");
    if (!res.ok) throw new Error("Failed to fetch programs");
    const rows = await res.json();
    return rows.map(deserializeProgram);
  },
  async add(payload) {
    const res = await fetch("/api/sheets/program", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", payload }),
    });
    return res.json();
  },
  async update(id, payload) {
    const res = await fetch("/api/sheets/program", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", id, payload }),
    });
    return res.json();
  },
  async delete(id) {
    const res = await fetch("/api/sheets/program", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    return res.json();
  },
};
