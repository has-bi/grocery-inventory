"use client";
import { useHealthTracker } from "@/hooks/useHealthTracker";
import DailyInput from "./DailyInput";
import MealBingo from "./MealBingo";
import ScoreCard from "./ScoreCard";
import WarningBanner from "./WarningBanner";
import HistoryView from "./HistoryView";
import { useState } from "react";
import { FiCheck } from "react-icons/fi";

function SaveIndicator({ saveStatus, lastSavedTime }) {
  if (!saveStatus) return null;

  if (saveStatus === "pending") {
    return (
      <span className="text-xs text-gray-400 flex items-center gap-1">
        <span className="inline-flex gap-0.5">
          <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
        </span>
      </span>
    );
  }

  if (saveStatus === "saving") {
    return <span className="text-xs text-gray-400">Menyimpan...</span>;
  }

  if (saveStatus === "saved" && lastSavedTime) {
    const time = lastSavedTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    return (
      <span className="text-xs text-green-600 flex items-center gap-1">
        <FiCheck size={11} />
        Tersimpan {time}
      </span>
    );
  }

  return null;
}

export default function TodayView() {
  const {
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
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <SaveIndicator saveStatus={saveStatus} lastSavedTime={lastSavedTime} />
      </div>

      <div className="flex gap-0 border-b border-gray-200 mb-6">
        {[{ key: "today", label: "Hari Ini" }, { key: "history", label: "History" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"
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
        </div>
      )}

      {tab === "history" && (
        <HistoryView logs={historyLogs} />
      )}
    </div>
  );
}
