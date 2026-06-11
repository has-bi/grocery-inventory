export default function DailyInput({ weight, exercise, onWeightChange, onExerciseChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Daily Check-in</h3>

      <div>
        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
          Berat Badan (kg)
        </label>
        <input
          type="number"
          step="0.1"
          min="30"
          max="200"
          placeholder="mis. 68.5"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          className="w-full sm:w-40 px-3 py-2.5 border border-gray-200 rounded-lg text-base sm:text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
          Olahraga Hari Ini?
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onExerciseChange(true)}
            className={`flex-1 sm:flex-none sm:px-8 py-2.5 rounded-lg text-sm font-medium border transition-colors active:scale-[0.98] ${
              exercise === true
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            Ya
          </button>
          <button
            onClick={() => onExerciseChange(false)}
            className={`flex-1 sm:flex-none sm:px-8 py-2.5 rounded-lg text-sm font-medium border transition-colors active:scale-[0.98] ${
              exercise === false
                ? "bg-gray-700 text-white border-gray-700"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
