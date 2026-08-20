"use client";
import { useState, useMemo } from "react";
import { FiX, FiSearch } from "react-icons/fi";

export default function ExercisePicker({ exercises, alreadyAdded, onSelect, onClose }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return exercises.filter(
      (e) =>
        !alreadyAdded.includes(e.name) &&
        (e.name.toLowerCase().includes(q) || e.muscle_group.toLowerCase().includes(q))
    );
  }, [exercises, alreadyAdded, query]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((e) => {
      if (!map[e.muscle_group]) map[e.muscle_group] = [];
      map[e.muscle_group].push(e);
    });
    return map;
  }, [filtered]);

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box rounded-t-2xl sm:rounded-2xl p-0 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-semibold">Pilih Exercise</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <FiX size={18} />
          </button>
        </div>

        <div className="px-5 pb-3">
          <label className="input input-bordered flex items-center gap-2">
            <FiSearch size={15} className="opacity-40 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Cari exercise..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="grow text-sm bg-transparent focus:outline-none"
            />
          </label>
        </div>

        <div className="overflow-y-auto px-3 pb-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-2">
              <p className="px-2 py-1.5 text-xs font-medium opacity-40 uppercase tracking-wider">{group}</p>
              {items.map((ex) => (
                <button
                  key={ex._id}
                  onClick={() => onSelect(ex.name)}
                  className="btn btn-ghost btn-block justify-start font-normal h-auto py-2.5"
                >
                  <div className="text-left">
                    <p className="text-sm">{ex.name}</p>
                    <p className="text-xs opacity-40">{ex.equipment}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm opacity-40">Tidak ditemukan</p>
              {query && (
                <button onClick={() => onSelect(query)} className="btn btn-primary btn-sm mt-3">
                  Tambah &ldquo;{query}&rdquo;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
