"use client";
import { useState, useEffect, useMemo } from "react";
import { workoutApi, bodyApi } from "@/actions/sheets";

function ExerciseChart({ data, label }) {
  if (data.length < 2) return null;
  const W = 300;
  const H = 100;
  const PAD = { top: 8, right: 8, bottom: 20, left: 32 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const minV = Math.min(...data.map((d) => d.value)) * 0.95;
  const maxV = Math.max(...data.map((d) => d.value)) * 1.05;

  const xScale = (i) => (i / (data.length - 1)) * chartW;
  const yScale = (v) => chartH - ((v - minV) / (maxV - minV || 1)) * chartH;
  const points = data.map((d, i) => `${xScale(i)},${yScale(d.value)}`).join(" ");

  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          <line x1={0} y1={0} x2={chartW} y2={0} stroke="#f0f0f0" strokeWidth={1} />
          <line x1={0} y1={chartH} x2={chartW} y2={chartH} stroke="#f0f0f0" strokeWidth={1} />
          <text x={-4} y={4} textAnchor="end" fontSize={9} fill="#9ca3af">{maxV.toFixed(1)}</text>
          <text x={-4} y={chartH + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{minV.toFixed(1)}</text>
          <polyline points={points} fill="none" stroke="#111" strokeWidth={1.5} strokeLinejoin="round" />
          {data.map((d, i) => (
            <circle key={i} cx={xScale(i)} cy={yScale(d.value)} r={3} fill="#111" />
          ))}
          {data.map((d, i) => {
            if (i !== 0 && i !== data.length - 1) return null;
            return (
              <text key={i} x={xScale(i)} y={chartH + 14} textAnchor={i === 0 ? "start" : "end"} fontSize={8} fill="#9ca3af">
                {new Date(d.date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default function SummaryView() {
  const [logs, setLogs] = useState([]);
  const [bodyMetrics, setBodyMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState("");

  useEffect(() => {
    Promise.all([workoutApi.getAll(), bodyApi.getAll()])
      .then(([l, b]) => {
        setLogs(l);
        setBodyMetrics(b.sort((a, b) => a.date.localeCompare(b.date)));
      })
      .finally(() => setLoading(false));
  }, []);

  const exerciseNames = useMemo(
    () => [...new Set(logs.map((l) => l.exercise_name))].sort(),
    [logs]
  );

  useEffect(() => {
    if (exerciseNames.length && !selectedExercise) setSelectedExercise(exerciseNames[0]);
  }, [exerciseNames, selectedExercise]);

  const exerciseStats = useMemo(() => {
    const map = {};
    logs.forEach((l) => {
      if (!map[l.exercise_name]) map[l.exercise_name] = { maxWeight: 0, totalSets: 0, totalRpe: 0, rpeCount: 0 };
      const s = map[l.exercise_name];
      if (l.weight > s.maxWeight) s.maxWeight = l.weight;
      s.totalSets += 1;
      if (l.rpe) { s.totalRpe += l.rpe; s.rpeCount += 1; }
    });
    return map;
  }, [logs]);

  const exerciseProgress = useMemo(() => {
    if (!selectedExercise) return [];
    const byDate = {};
    logs
      .filter((l) => l.exercise_name === selectedExercise)
      .forEach((l) => {
        if (!byDate[l.date] || l.weight > byDate[l.date]) byDate[l.date] = l.weight;
      });
    return Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, value]) => ({ date, value }));
  }, [logs, selectedExercise]);

  const bodyProgress = useMemo(
    () => bodyMetrics.map((m) => ({ date: m.date, value: m.weight })),
    [bodyMetrics]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col gap-3">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  const stats = exerciseStats[selectedExercise];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-light text-black">Progress</h2>
        <p className="text-sm text-gray-500 mt-0.5">Ringkasan perkembangan latihan</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Sesi", value: new Set(logs.map((l) => l.date + l.session)).size },
          { label: "Total Set", value: logs.length },
          { label: "Exercise", value: exerciseNames.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-xl font-light text-black">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {bodyProgress.length >= 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-600 mb-3">Tren Berat Badan</p>
          <ExerciseChart data={bodyProgress} label="kg" />
        </div>
      )}

      {exerciseNames.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Progress per Exercise</p>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            >
              {exerciseNames.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Max Beban", value: `${stats.maxWeight} kg` },
                { label: "Total Set", value: stats.totalSets },
                { label: "Rata-rata RPE", value: stats.rpeCount ? (stats.totalRpe / stats.rpeCount).toFixed(1) : "-" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-light text-black">{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          )}

          {exerciseProgress.length >= 2 && (
            <ExerciseChart data={exerciseProgress} label="kg (max per sesi)" />
          )}
          {exerciseProgress.length < 2 && exerciseProgress.length > 0 && (
            <p className="text-xs text-gray-400 text-center py-2">Log minimal 2 sesi untuk melihat grafik</p>
          )}
        </div>
      )}

      {logs.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Belum ada data latihan. Mulai log di tab Log!
        </div>
      )}
    </div>
  );
}
