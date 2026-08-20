"use client";
import { useState } from "react";
import { useWorkoutLog } from "@/hooks/useWorkoutLog";
import SetInputModal from "./SetInputModal";
import ExercisePicker from "./ExercisePicker";
import { FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";

const SESSIONS = ["Upper A", "Lower A", "Upper B", "Lower B", "Kondisioning"];

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
}

function SetChip({ log, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg border border-red-200">
        <button onClick={() => onDelete(log._id)} className="font-medium">Hapus?</button>
        <span className="text-red-300">·</span>
        <button onClick={() => setConfirming(false)} className="text-red-400">Batal</button>
      </span>
    );
  }
  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <span className="text-gray-400">#{log.set_number}</span>
      <span className="font-medium">{log.weight}kg × {log.reps}</span>
      <span className="text-gray-400">@{log.rpe}</span>
    </button>
  );
}

function ExerciseCard({ name, sets, programInfo, onLogSet, onDelete }) {
  const [open, setOpen] = useState(true);

  const targetLabel = programInfo
    ? `${programInfo.target_sets} × ${programInfo.target_reps}${programInfo.target_weight > 0 ? ` @ ${programInfo.target_weight}kg` : ""}  ·  ${programInfo.rest_seconds}s rest`
    : null;

  return (
    <div className="border border-gray-200 rounded-xl bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <div>
          <p className="text-sm font-medium text-black">{name}</p>
          {targetLabel && <p className="text-xs text-gray-400 mt-0.5">{targetLabel}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400">{sets.length} set</span>
          <FiChevronDown
            size={15}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {sets.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sets.map((s) => (
                <SetChip key={s._id} log={s} onDelete={onDelete} />
              ))}
            </div>
          )}
          <button
            onClick={onLogSet}
            className="flex items-center gap-1.5 text-sm text-black font-medium py-2 px-3 border border-dashed border-gray-300 rounded-lg w-full justify-center hover:border-black hover:bg-gray-50 transition-colors"
          >
            <FiPlus size={14} />
            Log Set
          </button>
        </div>
      )}
    </div>
  );
}

export default function WorkoutLogView() {
  const {
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
  } = useWorkoutLog();

  const [loggingExercise, setLoggingExercise] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const todayLabel = new Date(today + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long",
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col gap-3">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-12 text-sm">Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-black">Log Latihan</h2>
        <p className="text-sm text-gray-500 mt-0.5 capitalize">{todayLabel}</p>
      </div>

      {/* Session picker */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Sesi hari ini</p>
        <div className="flex flex-wrap gap-2">
          {SESSIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSession(s)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-all ${
                activeSession === s
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise cards */}
      {activeSession && (
        <div className="space-y-3">
          {todayExerciseNames.map((name) => {
            const progInfo = sessionProgram.find((p) => p.exercise_name === name) ?? null;
            return (
              <ExerciseCard
                key={name}
                name={name}
                sets={todayByExercise[name] || []}
                programInfo={progInfo}
                onLogSet={() => setLoggingExercise(name)}
                onDelete={deleteSet}
              />
            );
          })}

          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-gray-500 hover:text-black transition-colors"
          >
            <FiPlus size={15} />
            Tambah exercise lain
          </button>
        </div>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Sesi sebelumnya</p>
          <div className="space-y-1">
            {recentSessions.map((s) => (
              <div key={s.date} className="flex items-center justify-between py-2 px-1">
                <div>
                  <p className="text-sm text-black">{s.session}</p>
                  <p className="text-xs text-gray-400">{formatDate(s.date)}</p>
                </div>
                <span className="text-xs text-gray-400">{s.sets} set</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Set input modal */}
      {loggingExercise && (
        <SetInputModal
          exerciseName={loggingExercise}
          setNumber={(todayByExercise[loggingExercise]?.length ?? 0) + 1}
          prefillWeight={getLastWeight(loggingExercise)}
          onConfirm={(weight, reps, rpe) => {
            logSet(loggingExercise, weight, reps, rpe);
            setLoggingExercise(null);
          }}
          onClose={() => setLoggingExercise(null)}
        />
      )}

      {/* Exercise picker */}
      {showPicker && (
        <ExercisePicker
          exercises={exercises}
          alreadyAdded={todayExerciseNames}
          onSelect={(name) => {
            setShowPicker(false);
            setLoggingExercise(name);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
