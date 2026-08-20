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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-semibold text-black">Pilih Exercise</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <FiX size={18} />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl focus-within:border-black transition-colors">
            <FiSearch size={15} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Cari exercise..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-sm text-black focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="overflow-y-auto px-3 pb-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-2">
              <p className="px-2 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">{group}</p>
              {items.map((ex) => (
                <button
                  key={ex._id}
                  onClick={() => onSelect(ex.name)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm text-black">{ex.name}</p>
                  <p className="text-xs text-gray-400">{ex.equipment}</p>
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">Tidak ditemukan</p>
              {query && (
                <button
                  onClick={() => onSelect(query)}
                  className="mt-3 px-4 py-2 text-sm bg-black text-white rounded-lg"
                >
                  Tambah &ldquo;{query}&rdquo;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
