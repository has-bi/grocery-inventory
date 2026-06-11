import { FOOD_CATEGORIES, getFoodChipClass } from "@/lib/foodData";

const SESSIONS = [
  { key: "pagi", label: "Pagi" },
  { key: "siang", label: "Siang" },
  { key: "sore", label: "Sore" },
];

export default function MealBingo({ meals, onToggle }) {
  return (
    <div className="space-y-4">
      {SESSIONS.map((session) => {
        const selected = meals[session.key] || [];
        return (
          <div key={session.key} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">{session.label}</h3>
              {selected.length > 0 && (
                <span className="text-xs text-gray-400">{selected.length} dipilih</span>
              )}
            </div>

            <div className="space-y-3">
              {Object.entries(FOOD_CATEGORIES).map(([catKey, cat]) => (
                <div key={catKey}>
                  <p className="text-xs text-gray-400 mb-1.5">{cat.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((food) => {
                      const isSelected = selected.includes(food);
                      return (
                        <button
                          key={food}
                          onClick={() => onToggle(session.key, food)}
                          className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all active:scale-95 ${getFoodChipClass(
                            food,
                            isSelected
                          )}`}
                        >
                          {food}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
