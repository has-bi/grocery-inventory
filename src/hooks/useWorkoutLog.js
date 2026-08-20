"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { workoutApi, exercisesApi, programApi, scheduleApi } from "@/actions/sheets";
import { buildScheduleMap, computeStreak, recentDays } from "@/lib/streak";

/** Fallback only — the real list comes from whatever sessions the Sheet defines. */
export const SESSIONS = ["Upper A", "Lower A", "Upper B", "Lower B", "Kondisioning"];

function getLocalToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Sets count toward volume as weight × reps; bodyweight work still counts reps. */
function setVolume(l) {
  return (l.weight || 0) * (l.reps || 0);
}

export function useWorkoutLog() {
  const today = getLocalToday();
  const [logs, setLogs] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionTouched, setSessionTouched] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // The Schedule sheet may not exist yet on older deployments; the rest of
      // the screen still works without it, so its failure is not fatal.
      const [logsData, exData, progData, schedData] = await Promise.all([
        workoutApi.getAll(),
        exercisesApi.getAll(),
        programApi.getAll(),
        scheduleApi.getAll().catch(() => []),
      ]);
      setLogs(logsData);
      setExercises(exData);
      setPrograms(progData);
      setSchedule(Array.isArray(schedData) ? schedData : []);
      setError(null);

      const todayLogs = logsData.filter((l) => l.date === today);
      if (todayLogs.length > 0) {
        setActiveSession(todayLogs[todayLogs.length - 1].session);
        setSessionTouched(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const todayLogs = useMemo(() => logs.filter((l) => l.date === today), [logs, today]);

  const scheduleMap = useMemo(() => buildScheduleMap(schedule), [schedule]);

  const streak = useMemo(
    () => computeStreak(logs, scheduleMap, today),
    [logs, scheduleMap, today]
  );

  const weekStrip = useMemo(
    () => recentDays(logs, scheduleMap, today, 7),
    [logs, scheduleMap, today]
  );

  /** Session names come from the Sheet, falling back to the built-in split. */
  const sessions = useMemo(() => {
    const fromSheet = [
      ...new Set([
        ...schedule.map((s) => String(s.session || "").trim()),
        ...programs.map((p) => String(p.session || "").trim()),
      ]),
    ].filter((s) => s && s.toUpperCase() !== "REST");
    return fromSheet.length ? fromSheet : SESSIONS;
  }, [schedule, programs]);

  /**
   * Today's session comes from the Schedule sheet rather than a rotation
   * guess, so the app opens on whatever the plan actually says.
   */
  const suggestedSession = useMemo(() => {
    if (streak.todayPlan?.session && !streak.todayPlan.isRest) {
      return streak.todayPlan.session;
    }
    return sessions[0];
  }, [streak, sessions]);

  useEffect(() => {
    if (!loading && !sessionTouched && !activeSession) {
      setActiveSession(suggestedSession);
    }
  }, [loading, sessionTouched, activeSession, suggestedSession]);

  const selectSession = useCallback((s) => {
    setSessionTouched(true);
    setActiveSession(s);
  }, []);

  const todayByExercise = useMemo(() => {
    const map = {};
    todayLogs
      .filter((l) => l.session === activeSession)
      .sort((a, b) => a.set_number - b.set_number)
      .forEach((l) => {
        (map[l.exercise_name] ||= []).push(l);
      });
    return map;
  }, [todayLogs, activeSession]);

  const sessionProgram = useMemo(
    () => programs.filter((p) => p.session === activeSession).sort((a, b) => a.sort_order - b.sort_order),
    [programs, activeSession]
  );

  const todayExerciseNames = useMemo(() => {
    const programNames = sessionProgram.map((p) => p.exercise_name);
    const extras = Object.keys(todayByExercise).filter((n) => !programNames.includes(n));
    return [...programNames, ...extras];
  }, [sessionProgram, todayByExercise]);

  /** Overall completion for the session header: sets done vs. sets programmed. */
  const sessionProgress = useMemo(() => {
    const target = sessionProgram.reduce((sum, p) => sum + (p.target_sets || 0), 0);
    const done = Object.values(todayByExercise).reduce((sum, arr) => sum + arr.length, 0);
    const volume = Object.values(todayByExercise)
      .flat()
      .reduce((sum, l) => sum + setVolume(l), 0);
    return { done, target, volume, complete: target > 0 && done >= target };
  }, [sessionProgram, todayByExercise]);

  /**
   * The last time this exercise was trained on a different day — shown in the
   * logger so progressive overload is a decision, not a guess.
   */
  const getLastPerformance = useCallback(
    (exerciseName) => {
      const prior = logs.filter((l) => l.exercise_name === exerciseName && l.date !== today);
      if (!prior.length) return null;
      const lastDate = prior.map((l) => l.date).sort((a, b) => b.localeCompare(a))[0];
      const sets = prior
        .filter((l) => l.date === lastDate)
        .sort((a, b) => a.set_number - b.set_number);
      return { date: lastDate, sets };
    },
    [logs, today]
  );

  /** Heaviest set ever recorded, used to flag a new PR the moment it happens. */
  const getPersonalBest = useCallback(
    (exerciseName) => {
      const all = logs.filter((l) => l.exercise_name === exerciseName && l.weight > 0);
      if (!all.length) return null;
      return all.reduce((best, l) => (l.weight > best.weight ? l : best), all[0]);
    },
    [logs]
  );

  const getLastWeight = useCallback(
    (exerciseName) => {
      const last = getLastPerformance(exerciseName);
      if (last?.sets?.length) {
        return last.sets[last.sets.length - 1].weight || null;
      }
      const todaySets = logs
        .filter((l) => l.exercise_name === exerciseName && l.weight > 0)
        .sort((a, b) => b.date.localeCompare(a.date) || b.set_number - a.set_number);
      return todaySets[0]?.weight ?? null;
    },
    [getLastPerformance, logs]
  );

  const getLastReps = useCallback(
    (exerciseName) => {
      const last = getLastPerformance(exerciseName);
      if (last?.sets?.length) return last.sets[last.sets.length - 1].reps || null;
      return null;
    },
    [getLastPerformance]
  );

  const recentSessions = useMemo(() => {
    const byDate = {};
    logs
      .filter((l) => l.date !== today)
      .forEach((l) => {
        byDate[l.date] ||= { date: l.date, session: l.session, sets: 0, volume: 0 };
        byDate[l.date].sets += 1;
        byDate[l.date].volume += setVolume(l);
      });
    return Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  }, [logs, today]);

  const logSet = useCallback(
    async (exerciseName, weight, reps, rpe, notes = "") => {
      const existing = todayByExercise[exerciseName] || [];
      const setNumber = existing.length + 1;
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
      setLogs((prev) => [...prev, { _id: tempId, ...payload, weight, reps, rpe, set_number: setNumber }]);

      try {
        const result = await workoutApi.add(payload);
        setLogs((prev) => prev.map((l) => (l._id === tempId ? { ...l, _id: result._id } : l)));
      } catch (err) {
        setLogs((prev) => prev.filter((l) => l._id !== tempId));
        setError(err.message);
      }
    },
    [todayByExercise, today, activeSession]
  );

  const deleteSet = useCallback(
    async (id) => {
      const snapshot = logs;
      setLogs((prev) => prev.filter((l) => l._id !== id));
      try {
        await workoutApi.delete(id);
      } catch (err) {
        setLogs(snapshot);
        setError(err.message);
      }
    },
    [logs]
  );

  return {
    loading,
    error,
    today,
    activeSession,
    setActiveSession: selectSession,
    suggestedSession,
    todayByExercise,
    todayExerciseNames,
    sessionProgram,
    sessionProgress,
    sessions,
    streak,
    weekStrip,
    exercises,
    recentSessions,
    getLastWeight,
    getLastReps,
    getLastPerformance,
    getPersonalBest,
    logSet,
    deleteSet,
    refetch: fetchAll,
  };
}
