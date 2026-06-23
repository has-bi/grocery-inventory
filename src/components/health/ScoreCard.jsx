import { getScoreColor, getScoreBreakdown } from "@/lib/scoreCalculator";
import { FiCheck, FiMinus, FiX } from "react-icons/fi";

export default function ScoreCard({ score, entry, warnings }) {
  const { text, bg, label } = getScoreColor(score);
  const breakdown = entry ? getScoreBreakdown(entry, warnings ?? []) : [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-5 mb-4">
        <div className={`text-5xl font-light ${text}`}>{score}</div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Score Hari Ini</p>
          <div
            className="w-full bg-gray-100 rounded-full h-2"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            aria-label="Score hari ini"
          >
            <div
              className={`h-2 rounded-full transition-all duration-500 ${bg}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className={`text-xs mt-1.5 font-medium ${text}`}>{label}</p>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className="border-t border-gray-100 pt-3 space-y-2">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {item.isDeduction ? (
                  <FiX size={12} className="text-red-500 shrink-0" />
                ) : item.achieved ? (
                  <FiCheck size={12} className="text-emerald-600 shrink-0" />
                ) : (
                  <FiMinus size={12} className="text-gray-300 shrink-0" />
                )}
                <span className={`text-xs ${item.isDeduction ? "text-red-600" : item.achieved ? "text-gray-700" : "text-gray-400"}`}>
                  {item.label}
                </span>
              </div>
              <span className={`text-xs font-medium tabular-nums ${item.isDeduction ? "text-red-600" : item.achieved ? "text-emerald-600" : "text-gray-300"}`}>
                {item.delta > 0 ? `+${item.delta}` : item.delta}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
