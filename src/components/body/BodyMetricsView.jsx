"use client";
import { useState } from "react";
import { useBodyMetrics } from "@/hooks/useBodyMetrics";
import MetricsChart from "./MetricsChart";
import { FiTrash2, FiPlus, FiX, FiCheck } from "react-icons/fi";

function bmiLabel(bmi) {
  if (!bmi) return "";
  if (bmi < 18.5) return "Kurus";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obesitas";
}

function bmiColor(bmi) {
  if (!bmi) return "text-gray-500";
  if (bmi < 18.5) return "text-blue-600";
  if (bmi < 25) return "text-green-600";
  if (bmi < 30) return "text-amber-600";
  return "text-red-600";
}

function getLocalToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function BodyMetricsView() {
  const { loading, error, metrics, latest, addMetric, deleteMetric } = useBodyMetrics();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ weight: "", waist: "", height: "173", date: getLocalToday() });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.weight || !form.waist) return;
    setSaving(true);
    await addMetric(form);
    setForm({ weight: "", waist: "", height: form.height, date: getLocalToday() });
    setShowForm(false);
    setSaving(false);
  };

  const formatDate = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col gap-3">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500 py-12 text-sm">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-black">Body Metrics</h2>
          {latest && <p className="text-sm text-gray-500 mt-0.5">Update: {formatDate(latest.date)}</p>}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border transition-all ${
            showForm ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-black text-white border-black hover:bg-gray-800"
          }`}
        >
          {showForm ? <FiX size={15} /> : <FiPlus size={15} />}
          {showForm ? "Batal" : "Catat"}
        </button>
      </div>

      {/* Latest stats */}
      {latest && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Berat", value: `${latest.weight} kg` },
            { label: "Lingkar Perut", value: `${latest.waist} cm` },
            { label: "BMI", value: latest.bmi, extra: bmiLabel(latest.bmi), color: bmiColor(latest.bmi) },
          ].map(({ label, value, extra, color }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-3.5 text-center">
              <p className={`text-xl font-light ${color || "text-black"}`}>{value}</p>
              {extra && <p className={`text-xs font-medium ${color}`}>{extra}</p>}
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {metrics.length >= 2 && <MetricsChart metrics={metrics} />}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-medium text-black">Pengukuran Baru</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Berat (kg)</label>
              <input
                type="number" inputMode="decimal" step="0.1"
                required value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                placeholder="84.5"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Lingkar Perut (cm)</label>
              <input
                type="number" inputMode="decimal" step="0.5"
                required value={form.waist}
                onChange={(e) => setForm((f) => ({ ...f, waist: e.target.value }))}
                placeholder="98"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Tinggi (cm)</label>
              <input
                type="number" inputMode="decimal"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                placeholder="173"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Tanggal</label>
              <input
                type="date" value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || !form.weight || !form.waist}
            className="w-full py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheck size={15} />}
            Simpan
          </button>
        </form>
      )}

      {/* History */}
      {metrics.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Riwayat</p>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {metrics.map((m) => (
              <div key={m._id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-black">{formatDate(m.date)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {m.weight} kg · {m.waist} cm pinggang · BMI {m.bmi}
                  </p>
                </div>
                <button
                  onClick={() => deleteMetric(m._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {metrics.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Belum ada data. Catat pengukuran pertama lo!
        </div>
      )}
    </div>
  );
}
