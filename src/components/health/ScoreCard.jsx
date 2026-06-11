import { getScoreColor } from "@/lib/scoreCalculator";

export default function ScoreCard({ score }) {
  const { text, bg, label } = getScoreColor(score);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-5">
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
  );
}
