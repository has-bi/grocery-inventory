"use client";
import { useState, useEffect, useMemo } from "react";
import { programApi, exercisesApi } from "@/actions/sheets";

export const SESSIONS = ["Upper A", "Lower A", "Upper B", "Lower B", "Kondisioning"];

export function useProgram() {
  const [programs, setPrograms] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [progData, exData] = await Promise.all([
        programApi.getAll(),
        exercisesApi.getAll(),
      ]);
      setPrograms(progData);
      setExercises(exData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bySession = useMemo(() => {
    const map = {};
    SESSIONS.forEach((s) => { map[s] = []; });
    programs.forEach((p) => {
      if (!map[p.session]) map[p.session] = [];
      map[p.session].push(p);
    });
    SESSIONS.forEach((s) => {
      map[s].sort((a, b) => a.sort_order - b.sort_order);
    });
    return map;
  }, [programs]);

  const addExercise = async (session, exerciseName, targetSets, targetReps, restSeconds, targetWeight) => {
    const existingInSession = (bySession[session] || []);
    const sortOrder = existingInSession.length + 1;
    const payload = {
      session,
      exercise_name: exerciseName,
      target_sets: String(targetSets),
      target_reps: String(targetReps),
      rest_seconds: String(restSeconds),
      target_weight: String(targetWeight),
      sort_order: String(sortOrder),
    };
    const result = await programApi.add(payload);
    if (result.success) await fetchAll();
    return result;
  };

  const updateExercise = async (id, payload) => {
    const result = await programApi.update(id, payload);
    if (result.success) await fetchAll();
    return result;
  };

  const deleteExercise = async (id) => {
    setPrograms((prev) => prev.filter((p) => p._id !== id));
    try {
      await programApi.delete(id);
    } catch (err) {
      await fetchAll();
      setError(err.message);
    }
  };

  return {
    loading,
    error,
    bySession,
    exercises,
    addExercise,
    updateExercise,
    deleteExercise,
  };
}
