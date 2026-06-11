"use client";
import { useHealthTracker } from "@/hooks/useHealthTracker";
import DailyInput from "./DailyInput";
import MealBingo from "./MealBingo";
import ScoreCard from "./ScoreCard";
import WarningBanner from "./WarningBanner";
import HistoryView from "./HistoryView";
import { useState } from "react";

export default function TodayView() {
  const {
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
  } = useHealthTracker();

  const [tab, setTab] = useState("today");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 gap-3 flex-col">
        <span className="loading loading-spinner loading-lg text-black"></span>
        <p className="text-sm text-gray-500">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-12 text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light text-black">Intermitten</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="flex gap-0 border-b border-gray-200 mb-6">
        {[{ key: "today", label: "Hari Ini" }, { key: "history", label: "History" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "today" && (
        <div className="space-y-4">
          <WarningBanner warnings={warnings} />
          <ScoreCard score={score} />
          <DailyInput
            weight={todayEntry.weight}
            exercise={todayEntry.exercise}
            onWeightChange={setWeight}
            onExerciseChange={setExercise}
          />
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Meal Log</h3>
            <MealBingo meals={todayEntry.meals} onToggle={toggleMeal} />
          </div>
          <button
            onClick={saveToday}
            disabled={saving}
            className="w-full py-3 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Menyimpan..." : "Simpan Hari Ini"}
          </button>
        </div>
      )}

      {tab === "history" && (
        <HistoryView logs={historyLogs} />
      )}
    </div>
  );
}
