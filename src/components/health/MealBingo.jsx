"use client";
import { useState } from "react";
import { FOOD_CATEGORIES, ALL_FOODS, getFoodChipClass } from "@/lib/foodData";
import { FiPlus, FiX } from "react-icons/fi";

const CATEGORY_OPTIONS = [
  { key: "protein",   label: "Protein" },
  { key: "karboBaik", label: "Karbo Baik" },
  { key: "sayurBuah", label: "Sayur & Buah" },
  { key: "minuman",   label: "Minuman" },
  { key: "watch",     label: "Watch" },
  { key: "other",     label: "Lainnya" },
];

function getCustomChipClass(food, customCategories) {
  const catKey = customCategories[food] || "other";
  const cat = FOOD_CATEGORIES[catKey] || FOOD_CATEGORIES.other;
  return cat.activeClass;
}

export default function MealBingo({ meals, onToggle }) {
  const [customCategories, setCustomCategories] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputCategory, setInputCategory] = useState("other");

  const allSelected = [
    ...(meals.pagi || []),
    ...(meals.siang || []),
    ...(meals.sore || []),
  ];

  const customSelected = allSelected.filter((f) => !ALL_FOODS.includes(f));

  const handleAddCustom = () => {
    const name = inputName.trim();
    if (!name) return;
    if (!allSelected.includes(name)) {
      setCustomCategories((prev) => ({ ...prev, [name]: inputCategory }));
      onToggle(name);
    }
    setIsAdding(false);
    setInputName("");
    setInputCategory("other");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
      {allSelected.length > 0 && (
        <p className="text-xs text-gray-400">{allSelected.length} makanan hari ini</p>
      )}

      {Object.entries(FOOD_CATEGORIES).map(([catKey, cat]) => (
        <div key={catKey}>
          <p className="text-xs text-gray-500 mb-1.5">{cat.label}</p>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((food) => {
              const isSelected = allSelected.includes(food);
              return (
                <button
                  key={food}
                  onClick={() => onToggle(food)}
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

      {customSelected.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Lainnya</p>
          <div className="flex flex-wrap gap-2">
            {customSelected.map((food) => (
              <button
                key={food}
                onClick={() => onToggle(food)}
                aria-pressed={true}
                className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all active:scale-95 flex items-center gap-1.5 ${getCustomChipClass(food, customCategories)}`}
              >
                {food}
                <FiX size={12} />
              </button>
            ))}
          </div>
        </div>
      )}

      {isAdding ? (
        <div className="pt-1 space-y-2.5">
          <input
            type="text"
            placeholder="Nama makanan..."
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleAddCustom(); }
              if (e.key === "Escape") setIsAdding(false);
            }}
            autoFocus
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base sm:text-sm text-black focus:outline-none focus:border-black transition-colors"
          />
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
              onClick={() => setIsAdding(false)}
              className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleAddCustom}
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
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition-colors mt-1"
        >
          <FiPlus size={13} />
          Tambah makanan lain
        </button>
      )}
    </div>
  );
}
