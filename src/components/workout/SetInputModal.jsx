"use client";
import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

const RPE_OPTIONS = [6, 7, 8, 9, 10];

export default function SetInputModal({ exerciseName, setNumber, prefillWeight, onConfirm, onClose }) {
  const [weight, setWeight] = useState(String(prefillWeight ?? ""));
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState(7);
  const weightRef = useRef(null);

  useEffect(() => { weightRef.current?.focus(); }, []);

  const handleConfirm = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!w || !r) return;
    onConfirm(w, r, rpe);
  };

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box rounded-t-2xl sm:rounded-2xl px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-base-content/55 uppercase tracking-wider mb-0.5">Set {setNumber}</p>
            <h3 className="font-semibold text-base leading-tight">{exerciseName}</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <FiX size={18} />
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          {[
            { label: "Beban (kg)", value: weight, onChange: setWeight, inputMode: "decimal", step: "2.5", ref: weightRef },
            { label: "Reps", value: reps, onChange: setReps, inputMode: "numeric", step: "1" },
          ].map(({ label, value, onChange, inputMode, step, ref }) => (
            <div key={label} className="flex-1 form-control">
              <label className="label py-0 mb-2">
                <span className="label-text text-xs text-base-content/60">{label}</span>
              </label>
              <input
                ref={ref}
                type="number"
                inputMode={inputMode}
                step={step}
                min="0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                placeholder="0"
                className="input input-bordered w-full text-3xl font-light text-center h-16"
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="label py-0 mb-2">
            <span className="label-text text-xs text-base-content/60">RPE — tingkat usaha (6 mudah · 10 maksimal)</span>
          </label>
          <div className="join w-full">
            {RPE_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRpe(r)}
                className={`join-item btn flex-1 text-base ${rpe === r ? "btn-primary" : "btn-ghost border border-base-300"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!weight || !reps}
          className="btn btn-primary btn-block btn-lg"
        >
          Catat Set
        </button>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
