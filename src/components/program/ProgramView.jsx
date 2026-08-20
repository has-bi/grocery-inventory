"use client";
import { useState } from "react";
import { useProgram, SESSIONS } from "@/hooks/useProgram";
import Sheet from "@/components/ui/Sheet";
import { FiTrash2, FiPlus, FiSearch, FiAlertCircle } from "react-icons/fi";

function AddExerciseSheet({ exercises, session, onAdd, onClose }) {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10-12");
  const [rest, setRest] = useState("90");
  const [weight, setWeight] = useState("0");
  const [saving, setSaving] = useState(false);

  const trimmed = query.trim();
  const suggestions = trimmed && !name
    ? exercises.filter((e) => e.name.toLowerCase().includes(trimmed.toLowerCase())).slice(0, 5)
    : [];

  const resolved = name || trimmed;

  const submit = async () => {
    if (!resolved) return;
    setSaving(true);
    await onAdd(session, resolved, sets, reps, parseInt(rest) || 90, parseFloat(weight) || 0);
    setSaving(false);
    onClose();
  };

  return (
    <Sheet
      subtitle={session}
      title="Tambah Exercise"
      onClose={onClose}
      footer={
        <button onClick={submit} disabled={!resolved || saving} className="btn btn-primary btn-lg w-full">
          {saving ? "Menyimpan..." : "Tambah ke Program"}
        </button>
      }
    >
      <div className="space-y-4 pb-2">
        <div>
          <label htmlFor="pg-name" className="field-label">Nama exercise</label>
          <div className="relative">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
            />
            <input
              id="pg-name"
              autoFocus
              type="text"
              placeholder="Cari atau ketik nama baru..."
              value={name || query}
              onChange={(e) => { setQuery(e.target.value); setName(""); }}
              className="field pl-9"
            />
          </div>

          {suggestions.length > 0 && (
            <div className="mt-1.5 rounded-xl border border-line overflow-hidden divide-y divide-line">
              {suggestions.map((e) => (
                <button
                  key={e._id}
                  onClick={() => { setName(e.name); setQuery(e.name); }}
                  className="w-full text-left px-3 py-2.5 text-sm text-ink hover:bg-surface-raised transition-colors"
                >
                  {e.name}
                  {e.muscle_group && (
                    <span className="text-xs text-ink-muted ml-2">{e.muscle_group}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "sets", label: "Sets", value: sets, set: setSets, placeholder: "4" },
            { id: "reps", label: "Reps", value: reps, set: setReps, placeholder: "8-12" },
            { id: "rest", label: "Istirahat (detik)", value: rest, set: setRest, placeholder: "90" },
            { id: "weight", label: "Target (kg)", value: weight, set: setWeight, placeholder: "60" },
          ].map(({ id, label, value, set, placeholder }) => (
            <div key={id}>
              <label htmlFor={`pg-${id}`} className="field-label">{label}</label>
              <input
                id={`pg-${id}`}
                type="text"
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="field tabular"
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-faint">
          Istirahat dipakai buat timer otomatis setelah lo catat set.
        </p>
      </div>
    </Sheet>
  );
}

export default function ProgramView() {
  const { loading, error, bySession, exercises, addExercise, deleteExercise } = useProgram();
  const [activeSession, setActiveSession] = useState(SESSIONS[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="h-8 w-36 rounded-lg bg-surface-raised animate-pulse" />
        <div className="h-9 w-full rounded-xl bg-surface-raised animate-pulse" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 w-full rounded-2xl bg-surface-raised animate-pulse" />
        ))}
      </div>
    );
  }

  const list = bySession[activeSession] || [];
  const totalSets = list.reduce((n, p) => n + (p.target_sets || 0), 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <header>
        <h1 className="page-title">Program</h1>
        <p className="page-sub">Jadwal latihan mingguan</p>
      </header>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-3">
          <FiAlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SESSIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setActiveSession(s); setConfirmId(null); }}
            aria-pressed={activeSession === s}
            className={`btn btn-sm shrink-0 whitespace-nowrap ${
              activeSession === s ? "btn-primary" : "btn-secondary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {list.length > 0 && (
        <p className="text-xs text-ink-muted tabular">
          {list.length} exercise · {totalSets} set total
        </p>
      )}

      <div className="space-y-2">
        {list.map((p, idx) => (
          <div key={p._id} className="card px-4 py-3 flex items-center gap-3">
            <span className="w-5 shrink-0 text-xs font-semibold text-ink-faint tabular text-right">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{p.exercise_name}</p>
              <p className="text-xs text-ink-muted mt-0.5 tabular">
                {p.target_sets} × {p.target_reps}
                {p.target_weight > 0 ? ` @ ${p.target_weight}kg` : ""}
                {p.rest_seconds > 0 ? ` · ${p.rest_seconds}s` : ""}
              </p>
            </div>

            {confirmId === p._id ? (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { deleteExercise(p._id); setConfirmId(null); }}
                  className="btn btn-danger btn-xs px-2.5"
                >
                  Hapus
                </button>
                <button onClick={() => setConfirmId(null)} className="btn btn-ghost btn-xs px-2.5">
                  Batal
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(p._id)}
                aria-label={`Hapus ${p.exercise_name}`}
                className="btn btn-ghost btn-xs w-8 shrink-0"
              >
                <FiTrash2 size={14} />
              </button>
            )}
          </div>
        ))}

        {list.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-sm font-medium text-ink mb-1">Sesi ini masih kosong</p>
            <p className="text-sm text-ink-muted">Tambah exercise buat nyusun {activeSession}.</p>
          </div>
        )}

        <button
          onClick={() => setShowAdd(true)}
          className="btn btn-ghost btn-md w-full border border-dashed border-line-strong"
        >
          <FiPlus size={15} />
          Tambah exercise
        </button>
      </div>

      {showAdd && (
        <AddExerciseSheet
          exercises={exercises}
          session={activeSession}
          onAdd={addExercise}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
