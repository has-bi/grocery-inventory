"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { programApi, exercisesApi, scheduleApi } from "@/actions/sheets";

/** Fallback only — real session names come from the Sheet. */
export const SESSIONS = ["Upper A", "Lower A", "Upper B", "Lower B", "Kondisioning"];

/**
 * Read-only view of the program. Editing happens in the Google Sheet, so this
 * hook deliberately exposes no mutations.
 */
export function useProgram() {
  const [programs, setPrograms] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [progData, exData, schedData] = await Promise.all([
        programApi.getAll(),
        exercisesApi.getAll(),
        scheduleApi.getAll().catch(() => []),
      ]);
      setPrograms(progData);
      setExercises(exData);
      setSchedule(Array.isArray(schedData) ? schedData : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const bySession = useMemo(() => {
    const map = {};
    programs.forEach((p) => {
      const key = String(p.session || "").trim();
      if (!key) return;
      (map[key] ||= []).push(p);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.sort_order - b.sort_order));
    return map;
  }, [programs]);

  return { loading, error, programs, bySession, exercises, schedule, refetch: fetchAll };
}
