"use client";
import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

const RPE_OPTIONS = [6, 7, 8, 9, 10];

export default function SetInputModal({ exerciseName, setNumber, prefillWeight, onConfirm, onClose }) {
  const [weight, setWeight] = useState(String(prefillWeight ?? ""));
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState(7);
  const weightRef = useRef(null);

  useEffect(() => {
    weightRef.current?.focus();
  }, []);

  const handleConfirm = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!w || !r) return;
    onConfirm(w, r, rpe);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Set {setNumber}</p>
            <h3 className="text-base font-semibold text-black leading-tight">{exerciseName}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <FiX size={18} />
          </button>
        </div>

        <div className="flex gap-4 mb-5">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1.5">Beban (kg)</label>
            <input
              ref={weightRef}
              type="number"
              inputMode="decimal"
              step="2.5"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0"
              className="w-full text-2xl font-light text-center py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1.5">Reps</label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0"
              className="w-full text-2xl font-light text-center py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs text-gray-500 mb-2">RPE</label>
          <div className="flex gap-2">
            {RPE_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRpe(r)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  rpe === r
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!weight || !reps}
          className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Catat Set
        </button>
      </div>
    </div>
  );
}
