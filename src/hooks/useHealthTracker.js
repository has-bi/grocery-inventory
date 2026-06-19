"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { healthApi } from "@/actions/sheets";
import { runRuleEngine } from "@/lib/ruleEngine";
import { calculateScore } from "@/lib/scoreCalculator";

function getTodayDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const EMPTY_ENTRY = {
  weight: "",
  exercise: null,
  meals: { pagi: [], siang: [], sore: [] },
};

const DEBOUNCE_MS = 2000;

export function useHealthTracker() {
  const today = getTodayDate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayEntry, setTodayEntry] = useState({ date: today, ...EMPTY_ENTRY });
  const [changeCount, setChangeCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null); // null | "pending" | "saving" | "saved"
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const saveTimerRef = useRef(null);
  const doSaveRef = useRef(null);
  // Refs stay fresh every render so setTimeout always closes over latest values
  const todayEntryRef = useRef(todayEntry);
  const scoreRef = useRef(0);
  const warningsRef = useRef([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await healthApi.getAll();
      setLogs(data);
      const existing = data.find((l) => l.date === today);
      setTodayEntry(existing ?? { date: today, ...EMPTY_ENTRY });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const historyLogs = useMemo(
    () =>
      logs
        .filter((l) => l.date !== today)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 14),
    [logs, today]
  );

  const warnings = useMemo(
    () => runRuleEngine(todayEntry, historyLogs),
    [todayEntry, historyLogs]
  );

  const score = useMemo(
    () => calculateScore(todayEntry, warnings),
    [todayEntry, warnings]
  );

  // Keep refs current on every render
  todayEntryRef.current = todayEntry;
  scoreRef.current = score;
  warningsRef.current = warnings;

  doSaveRef.current = async () => {
    const snapshot = {
      ...todayEntryRef.current,
      score: scoreRef.current,
      warnings: warningsRef.current,
    };
    setSaveStatus("saving");
    try {
      await healthApi.upsert(snapshot);
      setLogs((prev) => {
        const idx = prev.findIndex((l) => l.date === snapshot.date);
        return idx >= 0
          ? prev.map((l, i) => (i === idx ? snapshot : l))
          : [...prev, snapshot];
      });
      setSaveStatus("saved");
      setLastSavedTime(new Date());
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setError(err.message);
      setSaveStatus(null);
    }
  };

  // Debounced auto-save — triggers whenever the user changes something
  useEffect(() => {
    if (changeCount === 0) return;

    setSaveStatus("pending");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      doSaveRef.current?.();
    }, DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [changeCount]);

  const bump = () => setChangeCount((c) => c + 1);

  const toggleMeal = (session, food) => {
    bump();
    setTodayEntry((prev) => {
      const current = prev.meals[session];
      const updated = current.includes(food)
        ? current.filter((f) => f !== food)
        : [...current, food];
      return { ...prev, meals: { ...prev.meals, [session]: updated } };
    });
  };

  const setWeight = (weight) => { bump(); setTodayEntry((prev) => ({ ...prev, weight })); };
  const setExercise = (value) => { bump(); setTodayEntry((prev) => ({ ...prev, exercise: value })); };

  return {
    loading,
    error,
    todayEntry,
    historyLogs,
    warnings,
    score,
    saveStatus,
    lastSavedTime,
    toggleMeal,
    setWeight,
    setExercise,
  };
}
