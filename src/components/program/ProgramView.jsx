"use client";
import { useState } from "react";
import { useProgram, SESSIONS } from "@/hooks/useProgram";
import { FiTrash2, FiPlus, FiX } from "react-icons/fi";

function AddExerciseForm({ exercises, session, onAdd, onClose }) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10-12");
  const [rest, setRest] = useState("90");
  const [weight, setWeight] = useState("0");
  const [query, setQuery] = useState("");

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="card card-compact bg-base-100 border border-dashed border-base-300">
      <div className="card-body gap-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">Tambah Exercise</p>
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle">
            <FiX size={16} />
          </button>
        </div>

        <div className="form-control">
          <label className="label py-0 mb-1">
            <span className="label-text text-xs text-base-content/60">Nama exercise</span>
          </label>
          <input
            type="text"
            placeholder="Cari atau ketik nama..."
            value={name || query}
            onChange={(e) => { setQuery(e.target.value); setName(""); }}
            className="input input-bordered input-sm"
          />
          {query && !name && (
            <div className="border border-base-300 rounded-lg mt-1 overflow-hidden max-h-36 overflow-y-auto bg-base-100">
              {filtered.slice(0, 6).map((e) => (
                <button
                  key={e._id}
                  onClick={() => { setName(e.name); setQuery(e.name); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-base-200 transition-colors"
                >
                  {e.name}
                </button>
              ))}
              {filtered.length === 0 && (
                <button
                  onClick={() => setName(query)}
                  className="w-full text-left px-3 py-2 text-sm text-base-content/60 hover:bg-base-200"
                >
                  Pakai &ldquo;{query}&rdquo;
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Sets", value: sets, set: setSets, placeholder: "4" },
            { label: "Reps", value: reps, set: setReps, placeholder: "8-12" },
            { label: "Rest (detik)", value: rest, set: setRest, placeholder: "90" },
            { label: "Target (kg)", value: weight, set: setWeight, placeholder: "60" },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label} className="form-control">
              <label className="label py-0 mb-1">
                <span className="label-text text-xs text-base-content/60">{label}</span>
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="input input-bordered input-sm"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const n = name || query;
            if (!n) return;
            onAdd(session, n, sets, reps, parseInt(rest) || 90, parseFloat(weight) || 0);
            setName(""); setQuery(""); setSets("3"); setReps("10-12"); setRest("90"); setWeight("0");
            onClose();
          }}
          disabled={!name && !query}
          className="btn btn-primary btn-block btn-sm"
        >
          Tambah
        </button>
      </div>
    </div>
  );
}

export default function ProgramView() {
  const { loading, error, bySession, exercises, addExercise, deleteExercise } = useProgram();
  const [activeSession, setActiveSession] = useState(SESSIONS[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) return (
    <div className="flex justify-center items-center h-64 flex-col gap-3">
      <span className="loading loading-spinner loading-md" />
      <p className="text-sm text-base-content/50">Loading...</p>
    </div>
  );

  if (error) return <div className="alert alert-error m-4 text-sm">{error}</div>;

  const sessionExercises = bySession[activeSession] || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h2 className="text-2xl font-light">Program</h2>
        <p className="text-sm text-base-content/60 mt-0.5">Jadwal latihan mingguan</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SESSIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setActiveSession(s); setShowAddForm(false); }}
            className={`btn btn-sm ${activeSession === s ? "btn-primary" : "btn-ghost border border-base-300"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {sessionExercises.length === 0 && !showAddForm && (
          <p className="text-sm text-base-content/50 py-6 text-center">Belum ada exercise di sesi ini.</p>
        )}

        {sessionExercises.map((p, idx) => (
          <div key={p._id} className="card card-compact bg-base-100 border border-base-300">
            <div className="card-body flex-row items-start gap-3">
              <span className="text-xs text-base-content/40 font-mono mt-0.5 w-5 text-right shrink-0">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{p.exercise_name}</p>
                <p className="text-xs text-base-content/55 mt-0.5">
                  {p.target_sets} × {p.target_reps}
                  {p.target_weight > 0 ? ` @ ${p.target_weight}kg` : ""}
                  {p.rest_seconds > 0 ? `  ·  ${p.rest_seconds}s rest` : ""}
                </p>
              </div>
              <button
                onClick={() => deleteExercise(p._id)}
                className="btn btn-ghost btn-xs text-error shrink-0"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {showAddForm ? (
          <AddExerciseForm
            exercises={exercises}
            session={activeSession}
            onAdd={addExercise}
            onClose={() => setShowAddForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-outline btn-block"
          >
            <FiPlus size={15} />
            Tambah exercise
          </button>
        )}
      </div>
    </div>
  );
}
