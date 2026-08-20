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
    <div className="border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-black">Tambah Exercise</p>
        <button onClick={onClose} className="text-gray-400 hover:text-black">
          <FiX size={16} />
        </button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Nama exercise..."
          value={name || query}
          onChange={(e) => { setQuery(e.target.value); setName(""); }}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
        />
        {query && !name && (
          <div className="border border-gray-200 rounded-lg mt-1 overflow-hidden max-h-36 overflow-y-auto">
            {filtered.slice(0, 6).map((e) => (
              <button
                key={e._id}
                onClick={() => { setName(e.name); setQuery(e.name); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                {e.name}
              </button>
            ))}
            {filtered.length === 0 && (
              <button
                onClick={() => setName(query)}
                className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
              >
                Pakai &ldquo;{query}&rdquo;
              </button>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Sets", value: sets, set: setSets, placeholder: "4" },
          { label: "Reps", value: reps, set: setReps, placeholder: "8-12" },
          { label: "Rest (detik)", value: rest, set: setRest, placeholder: "90" },
          { label: "Target (kg)", value: weight, set: setWeight, placeholder: "60" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
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
        className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors"
      >
        Tambah
      </button>
    </div>
  );
}

export default function ProgramView() {
  const { loading, error, bySession, exercises, addExercise, deleteExercise } = useProgram();
  const [activeSession, setActiveSession] = useState(SESSIONS[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col gap-3">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500 py-12 text-sm">Error: {error}</div>;

  const sessionExercises = bySession[activeSession] || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h2 className="text-2xl font-light text-black">Program</h2>
        <p className="text-sm text-gray-500 mt-0.5">Jadwal latihan mingguan</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SESSIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setActiveSession(s); setShowAddForm(false); }}
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

      <div className="space-y-2">
        {sessionExercises.length === 0 && !showAddForm && (
          <p className="text-sm text-gray-400 py-4 text-center">Belum ada exercise di sesi ini.</p>
        )}
        {sessionExercises.map((p, idx) => (
          <div key={p._id} className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-xs text-gray-300 font-mono mt-0.5 w-4 text-right">{idx + 1}</span>
              <div>
                <p className="text-sm font-medium text-black">{p.exercise_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {p.target_sets} × {p.target_reps}
                  {p.target_weight > 0 ? ` @ ${p.target_weight}kg` : ""}
                  {p.rest_seconds > 0 ? `  ·  ${p.rest_seconds}s rest` : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => deleteExercise(p._id)}
              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            >
              <FiTrash2 size={14} />
            </button>
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
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-gray-500 hover:text-black transition-colors"
          >
            <FiPlus size={15} />
            Tambah exercise
          </button>
        )}
      </div>
    </div>
  );
}
