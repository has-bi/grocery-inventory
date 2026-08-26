import { normalizeReps } from "@/lib/reps";

/** Every read goes through here so the route's diagnosis reaches the screen. */
async function read(url, what) {
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Nggak ada koneksi.");
  }

  if (res.status === 401) throw new Error("Sesi lo habis. Login ulang.");

  const data = await res.json().catch(() => null);

  // The route explains *why* it failed; passing that through beats a generic
  // "Failed to fetch", which sent us looking in the wrong place entirely.
  if (!res.ok || (data && data.error)) {
    throw new Error(data?.error || `Gagal ambil ${what} (${res.status}).`);
  }
  if (!Array.isArray(data)) throw new Error(`Format ${what} nggak sesuai.`);
  return data;
}

/**
 * Every mutating call goes through here.
 *
 * These used to `return res.json()` with no status check, so a 500 — or a 401
 * from an expired session — resolved as if it had succeeded. The caller's
 * catch never ran and the UI showed writes that never reached the sheet.
 */
async function mutate(url, body) {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Nggak ada koneksi. Data belum tersimpan.");
  }

  if (res.status === 401) {
    throw new Error("Sesi lo habis. Login ulang buat nyimpen.");
  }
  if (!res.ok) {
    throw new Error(`Server nolak (${res.status}). Data belum tersimpan.`);
  }

  const data = await res.json().catch(() => null);
  if (!data || data.error) {
    throw new Error(data?.error || "Respons server nggak valid.");
  }
  return data;
}

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
    // The Programs sheet shipped with an `id` header instead of `_id`; accept
    // either so rows keep a stable React key on sheets that predate the fix.
    _id: row._id ?? row.id ?? "",
    target_sets: parseInt(row.target_sets) || 0,
    target_reps: normalizeReps(row.target_reps),
    rest_seconds: parseInt(row.rest_seconds) || 0,
    target_weight: parseFloat(row.target_weight) || 0,
    sort_order: parseInt(row.sort_order) || 0,
  };
}

/**
 * One request for every sheet.
 *
 * Falls back to the per-sheet endpoints when Apps Script has not been updated
 * with getBundle yet, so an out-of-date deployment keeps working rather than
 * breaking the whole app.
 */
export async function fetchBundle() {
  let res;
  try {
    res = await fetch("/api/sheets/bundle");
  } catch {
    throw new Error("Nggak ada koneksi.");
  }

  if (res.status === 401) throw new Error("Sesi lo habis. Login ulang.");

  if (res.status === 501) {
    const [BodyMetrics, Exercises, WorkoutLogs, Programs, Schedule] = await Promise.all([
      read("/api/sheets/body", "body metrics"),
      read("/api/sheets/exercises", "daftar gerakan"),
      read("/api/sheets/workout", "log latihan"),
      read("/api/sheets/program", "program"),
      read("/api/sheets/schedule", "jadwal").catch(() => []),
    ]);
    return { BodyMetrics, Exercises, WorkoutLogs, Programs, Schedule };
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    throw new Error(data?.error || `Gagal ambil data (${res.status}).`);
  }
  return data;
}

/** Shapes the raw bundle into what the hooks expect. */
export function deserializeBundle(b) {
  return {
    bodyMetrics: (b.BodyMetrics || []).map(deserializeBodyMetric),
    exercises: b.Exercises || [],
    workoutLogs: (b.WorkoutLogs || []).map(deserializeWorkoutLog),
    programs: (b.Programs || []).map(deserializeProgram),
    schedule: b.Schedule || [],
  };
}

export const bodyApi = {
  async getAll() {
    return (await read("/api/sheets/body", "body metrics")).map(deserializeBodyMetric);
  },
  async add(payload) {
    return mutate("/api/sheets/body", { action: "add", payload });
  },
  async delete(id) {
    return mutate("/api/sheets/body", { action: "delete", id });
  },
};

export const scheduleApi = {
  async getAll() {
    return read("/api/sheets/schedule", "jadwal");
  },
};

export const exercisesApi = {
  async getAll() {
    return read("/api/sheets/exercises", "daftar gerakan");
  },
  async add(payload) {
    return mutate("/api/sheets/exercises", { action: "add", payload });
  },
};

export const workoutApi = {
  async getAll() {
    return (await read("/api/sheets/workout", "log latihan")).map(deserializeWorkoutLog);
  },
  async add(payload) {
    return mutate("/api/sheets/workout", { action: "add", payload });
  },
  async update(id, payload) {
    return mutate("/api/sheets/workout", { action: "update", id, payload });
  },
  async delete(id) {
    return mutate("/api/sheets/workout", { action: "delete", id });
  },
};

export const programApi = {
  async getAll() {
    return (await read("/api/sheets/program", "program")).map(deserializeProgram);
  },
  async add(payload) {
    return mutate("/api/sheets/program", { action: "add", payload });
  },
  async update(id, payload) {
    return mutate("/api/sheets/program", { action: "update", id, payload });
  },
  async delete(id) {
    return mutate("/api/sheets/program", { action: "delete", id });
  },
};
