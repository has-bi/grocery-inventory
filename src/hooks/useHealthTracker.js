"use client";
import { useState, useEffect, useMemo } from "react";
import { healthApi } from "@/actions/sheets";
import { runRuleEngine } from "@/lib/ruleEngine";
import { calculateScore } from "@/lib/scoreCalculator";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

const EMPTY_ENTRY = {
  weight: "",
  exercise: null,
  meals: { pagi: [], siang: [], sore: [] },
};

export function useHealthTracker() {
  const today = getTodayDate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [todayEntry, setTodayEntry] = useState({ date: today, ...EMPTY_ENTRY });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await healthApi.getAll();
      setLogs(data);

      const existing = data.find((l) => l.date === today);
      if (existing) {
        setTodayEntry(existing);
      } else {
        setTodayEntry({ date: today, ...EMPTY_ENTRY });
      }
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

  const toggleMeal = (session, food) => {
    setTodayEntry((prev) => {
      const current = prev.meals[session];
      const updated = current.includes(food)
        ? current.filter((f) => f !== food)
        : [...current, food];
      return { ...prev, meals: { ...prev.meals, [session]: updated } };
    });
  };

  const setWeight = (weight) => {
    setTodayEntry((prev) => ({ ...prev, weight }));
  };

  const setExercise = (value) => {
    setTodayEntry((prev) => ({ ...prev, exercise: value }));
  };

  const saveToday = async () => {
    setSaving(true);
    try {
      const entry = { ...todayEntry, score, warnings };
      await healthApi.upsert(entry);
      await fetchLogs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    error,
    todayEntry,
    historyLogs,
    warnings,
    score,
    toggleMeal,
    setWeight,
    setExercise,
    saveToday,
  };
}
