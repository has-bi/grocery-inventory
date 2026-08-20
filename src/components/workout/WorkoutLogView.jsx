"use client";
import { useState } from "react";
import { useWorkoutLog } from "@/hooks/useWorkoutLog";
import SetInputModal from "./SetInputModal";
import ExercisePicker from "./ExercisePicker";
import { FiPlus, FiChevronDown } from "react-icons/fi";

const SESSIONS = ["Upper A", "Lower A", "Upper B", "Lower B", "Kondisioning"];

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short",
  });
}

function SetChip({ log, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="badge badge-error badge-outline gap-1 cursor-default">
        <button onClick={() => onDelete(log._id)} className="font-medium">Hapus?</button>
        <span>·</span>
        <button onClick={() => setConfirming(false)}>Batal</button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="badge badge-ghost badge-lg gap-1 hover:badge-neutral cursor-pointer"
    >
      <span className="opacity-40">#{log.set_number}</span>
      <span className="font-medium">{log.weight}kg × {log.reps}</span>
      <span className="opacity-40">@{log.rpe}</span>
    </button>
  );
}

function ExerciseCard({ name, sets, programInfo, onLogSet, onDelete }) {
  const [open, setOpen] = useState(true);

  const targetLabel = programInfo
    ? `${programInfo.target_sets} × ${programInfo.target_reps}${programInfo.target_weight > 0 ? ` @ ${programInfo.target_weight}kg` : ""}  ·  ${programInfo.rest_seconds}s rest`
    : null;

  return (
    <div className="card card-compact bg-base-100 border border-base-300">
      <button
        onClick={() => setOpen((o) => !o)}
        className="card-body flex-row items-center justify-between text-left"
      >
        <div>
          <p className="font-medium text-sm">{name}</p>
          {targetLabel && <p className="text-xs opacity-40 mt-0.5">{targetLabel}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs opacity-30">{sets.length} set</span>
          <FiChevronDown
            size={15}
            className={`opacity-30 transition-transform ${open ? "rotate-180" : ""}`}
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
          <button onClick={onLogSet} className="btn btn-outline btn-sm btn-block">
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
    loading, error, today, activeSession, setActiveSession,
    todayByExercise, todayExerciseNames, sessionProgram,
    exercises, recentSessions, getLastWeight, logSet, deleteSet,
  } = useWorkoutLog();

  const [loggingExercise, setLoggingExercise] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const todayLabel = new Date(today + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long",
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64 flex-col gap-3">
      <span className="loading loading-spinner loading-md" />
      <p className="text-sm opacity-50">Loading...</p>
    </div>
  );

  if (error) return <div className="alert alert-error m-4 text-sm">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h2 className="text-2xl font-light">Log Latihan</h2>
        <p className="text-sm opacity-50 mt-0.5 capitalize">{todayLabel}</p>
      </div>

      {/* Session picker */}
      <div>
        <p className="text-xs opacity-40 mb-2">Sesi hari ini</p>
        <div className="flex flex-wrap gap-2">
          {SESSIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSession(s)}
              className={`btn btn-sm ${activeSession === s ? "btn-primary" : "btn-ghost border border-base-300"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise cards */}
      {activeSession && (
        <div className="space-y-3">
          {todayExerciseNames.map((name) => (
            <ExerciseCard
              key={name}
              name={name}
              sets={todayByExercise[name] || []}
              programInfo={sessionProgram.find((p) => p.exercise_name === name) ?? null}
              onLogSet={() => setLoggingExercise(name)}
              onDelete={deleteSet}
            />
          ))}
          <button onClick={() => setShowPicker(true)} className="btn btn-outline btn-block">
            <FiPlus size={15} />
            Tambah exercise lain
          </button>
        </div>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div>
          <p className="text-xs opacity-40 uppercase tracking-wider mb-2">Sesi sebelumnya</p>
          <div className="divide-y divide-base-300">
            {recentSessions.map((s) => (
              <div key={s.date} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium">{s.session}</p>
                  <p className="text-xs opacity-40">{formatDate(s.date)}</p>
                </div>
                <span className="badge badge-ghost">{s.sets} set</span>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {showPicker && (
        <ExercisePicker
          exercises={exercises}
          alreadyAdded={todayExerciseNames}
          onSelect={(name) => { setShowPicker(false); setLoggingExercise(name); }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
