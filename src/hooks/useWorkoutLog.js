"use client";
import { useState, useEffect, useMemo } from "react";
import { workoutApi, exercisesApi, programApi } from "@/actions/sheets";

function getLocalToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useWorkoutLog() {
  const today = getLocalToday();
  const [logs, setLogs] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    fetchAll(); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [logsData, exData, progData] = await Promise.all([
        workoutApi.getAll(),
        exercisesApi.getAll(),
        programApi.getAll(),
      ]);
      setLogs(logsData);
      setExercises(exData);
      setPrograms(progData);

      const todayLogs = logsData.filter((l) => l.date === today);
      if (todayLogs.length > 0) {
        setActiveSession(todayLogs[todayLogs.length - 1].session);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const todayLogs = useMemo(
    () => logs.filter((l) => l.date === today),
    [logs, today]
  );

  const todayByExercise = useMemo(() => {
    const map = {};
    todayLogs
      .filter((l) => l.session === activeSession)
      .sort((a, b) => a.set_number - b.set_number)
      .forEach((l) => {
        if (!map[l.exercise_name]) map[l.exercise_name] = [];
        map[l.exercise_name].push(l);
      });
    return map;
  }, [todayLogs, activeSession]);

  const sessionProgram = useMemo(
    () =>
      programs
        .filter((p) => p.session === activeSession)
        .sort((a, b) => a.sort_order - b.sort_order),
    [programs, activeSession]
  );

  const todayExerciseNames = useMemo(() => {
    const programNames = sessionProgram.map((p) => p.exercise_name);
    const extraNames = Object.keys(todayByExercise).filter(
      (n) => !programNames.includes(n)
    );
    return [...programNames, ...extraNames];
  }, [sessionProgram, todayByExercise]);

  const recentSessions = useMemo(() => {
    const byDate = {};
    logs
      .filter((l) => l.date !== today)
      .forEach((l) => {
        if (!byDate[l.date]) byDate[l.date] = { date: l.date, session: l.session, sets: 0 };
        byDate[l.date].sets += 1;
      });
    return Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  }, [logs, today]);

  const getLastWeight = (exerciseName) => {
    const previous = logs
      .filter((l) => l.exercise_name === exerciseName && l.weight > 0)
      .sort((a, b) => b.date.localeCompare(a.date) || b.set_number - a.set_number);
    return previous[0]?.weight ?? null;
  };

  const logSet = async (exerciseName, weight, reps, rpe, notes = "") => {
    const existingSets = todayByExercise[exerciseName] || [];
    const setNumber = existingSets.length + 1;
    const payload = {
      date: today,
      session: activeSession,
      exercise_name: exerciseName,
      set_number: String(setNumber),
      weight: String(weight),
      reps: String(reps),
      rpe: String(rpe),
      notes,
    };
    const tempId = `temp_${Date.now()}`;
    const tempLog = { _id: tempId, ...payload, weight, reps, rpe, set_number: setNumber };
    setLogs((prev) => [...prev, tempLog]);

    try {
      const result = await workoutApi.add(payload);
      setLogs((prev) =>
        prev.map((l) => (l._id === tempId ? { ...l, _id: result._id } : l))
      );
    } catch (err) {
      setLogs((prev) => prev.filter((l) => l._id !== tempId));
      setError(err.message);
    }
  };

  const deleteSet = async (id) => {
    setLogs((prev) => prev.filter((l) => l._id !== id));
    try {
      await workoutApi.delete(id);
    } catch (err) {
      await fetchAll();
      setError(err.message);
    }
  };

  return {
    loading,
    error,
    today,
    activeSession,
    setActiveSession,
    todayByExercise,
    todayExerciseNames,
    sessionProgram,
    exercises,
    recentSessions,
    getLastWeight,
    logSet,
    deleteSet,
  };
}
