"use client";
import { useState } from "react";
import { FOOD_CATEGORIES, ALL_FOODS, getFoodChipClass } from "@/lib/foodData";
import { FiPlus, FiX } from "react-icons/fi";

const SESSIONS = [
  { key: "pagi", label: "Pagi" },
  { key: "siang", label: "Siang" },
  { key: "sore", label: "Sore" },
];

const CATEGORY_OPTIONS = [
  { key: "protein",   label: "Protein" },
  { key: "karboBaik", label: "Karbo Baik" },
  { key: "sayurBuah", label: "Sayur & Buah" },
  { key: "minuman",   label: "Minuman" },
  { key: "watch",     label: "Watch" },
  { key: "other",     label: "Lainnya" },
];

function getChipClass(food, isSelected, customCategories) {
  const catKey = customCategories[food] || "other";
  const cat = FOOD_CATEGORIES[catKey] || FOOD_CATEGORIES.other;
  if (!ALL_FOODS.includes(food)) {
    return isSelected ? cat.activeClass : cat.chipClass;
  }
  return getFoodChipClass(food, isSelected);
}

export default function MealBingo({ meals, onToggle }) {
  // map of foodName → categoryKey for custom entries
  const [customCategories, setCustomCategories] = useState({});
  // which session has the add form open
  const [addingSession, setAddingSession] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputCategory, setInputCategory] = useState("other");

  const openAddForm = (sessionKey) => {
    setAddingSession(sessionKey);
    setInputName("");
    setInputCategory("other");
  };

  const handleAddCustom = (sessionKey) => {
    const name = inputName.trim();
    if (!name) return;
    const selected = meals[sessionKey] || [];
    if (!selected.includes(name)) {
      setCustomCategories((prev) => ({ ...prev, [name]: inputCategory }));
      onToggle(sessionKey, name);
    }
    setAddingSession(null);
    setInputName("");
  };

  return (
    <div className="space-y-4">
      {SESSIONS.map((session) => {
        const selected = meals[session.key] || [];
        const customSelected = selected.filter((f) => !ALL_FOODS.includes(f));

        return (
          <div key={session.key} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">{session.label}</h3>
              {selected.length > 0 && (
                <span className="text-xs text-gray-500">{selected.length} dipilih</span>
              )}
            </div>

            <div className="space-y-3">
              {/* Predefined food categories */}
              {Object.entries(FOOD_CATEGORIES).map(([catKey, cat]) => (
                <div key={catKey}>
                  <p className="text-xs text-gray-500 mb-1.5">{cat.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((food) => {
                      const isSelected = selected.includes(food);
                      return (
                        <button
                          key={food}
                          onClick={() => onToggle(session.key, food)}
                          aria-pressed={isSelected}
                          className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all active:scale-95 ${getFoodChipClass(food, isSelected)}`}
                        >
                          {food}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Custom entries for this session */}
              {customSelected.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Lainnya (custom)</p>
                  <div className="flex flex-wrap gap-2">
                    {customSelected.map((food) => (
                      <button
                        key={food}
                        onClick={() => onToggle(session.key, food)}
                        aria-pressed={true}
                        className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all active:scale-95 flex items-center gap-1.5 ${getChipClass(food, true, customCategories)}`}
                      >
                        {food}
                        <FiX size={12} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add custom food form */}
              {addingSession === session.key ? (
                <div className="pt-1 space-y-2.5">
                  <input
                    type="text"
                    placeholder="Nama makanan..."
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleAddCustom(session.key); }
                      if (e.key === "Escape") setAddingSession(null);
                    }}
                    autoFocus
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base sm:text-sm text-black focus:outline-none focus:border-black transition-colors"
                  />

                  {/* Category selector */}
                  <div className="flex gap-1.5 flex-wrap">
                    {CATEGORY_OPTIONS.map((opt) => {
                      const cat = FOOD_CATEGORIES[opt.key];
                      const isActive = inputCategory === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setInputCategory(opt.key)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                            isActive ? cat.activeClass : cat.chipClass
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingSession(null)}
                      className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCustom(session.key)}
                      disabled={!inputName.trim()}
                      className="flex-1 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAddForm(session.key)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition-colors mt-1"
                >
                  <FiPlus size={13} />
                  Tambah makanan lain
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
