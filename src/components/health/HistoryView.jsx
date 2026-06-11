import { getScoreColor } from "@/lib/scoreCalculator";
import WeightChart from "./WeightChart";

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
}

export default function HistoryView({ logs }) {
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <WeightChart logs={sorted} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-700">14 Hari Terakhir</h3>
        </div>

        {sorted.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Belum ada data. Mulai log hari ini!
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2.5 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Berat</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Olahraga</th>
                <th className="text-right py-2.5 px-5 text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((log) => {
                const { text, label } = getScoreColor(log.score);
                const hasPenalty = log.warnings?.some((w) => w.type === "consecutive_bad_food");
                return (
                  <tr key={log.date} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-black">{formatDate(log.date)}</span>
                        {hasPenalty && (
                          <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">!</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.weight ? `${log.weight} kg` : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${log.exercise ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {log.exercise ? "Ya" : "Skip"}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <span className={`text-sm font-medium ${text}`}>{log.score}</span>
                      <span className="text-xs text-gray-500 ml-1">/ 100</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
