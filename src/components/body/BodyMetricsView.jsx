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
  if (!bmi) return "";
  if (bmi < 18.5) return "text-info";
  if (bmi < 25) return "text-success";
  if (bmi < 30) return "text-warning";
  return "text-error";
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

  if (loading) return (
    <div className="flex justify-center items-center h-64 flex-col gap-3">
      <span className="loading loading-spinner loading-md" />
      <p className="text-sm text-base-content/50">Loading...</p>
    </div>
  );

  if (error) return <div className="alert alert-error m-4 text-sm">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light">Body Metrics</h2>
          {latest && <p className="text-sm text-base-content/60 mt-0.5">Update: {formatDate(latest.date)}</p>}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`btn btn-sm ${showForm ? "btn-ghost" : "btn-primary"}`}
        >
          {showForm ? <FiX size={15} /> : <FiPlus size={15} />}
          {showForm ? "Batal" : "Catat"}
        </button>
      </div>

      {/* Stats */}
      {latest && (
        <div className="overflow-x-auto">
          <div className="stats stats-horizontal w-full min-w-[280px] bg-base-100 border border-base-300 rounded-2xl shadow-none">
            <div className="stat">
              <div className="stat-title text-xs">Berat</div>
              <div className="stat-value text-2xl font-light">{latest.weight}</div>
              <div className="stat-desc text-sm font-medium">kg</div>
            </div>
            <div className="stat">
              <div className="stat-title text-xs">Pinggang</div>
              <div className="stat-value text-2xl font-light">{latest.waist}</div>
              <div className="stat-desc text-sm font-medium">cm</div>
            </div>
            <div className="stat">
              <div className="stat-title text-xs">BMI</div>
              <div className={`stat-value text-2xl font-light ${bmiColor(latest.bmi)}`}>{latest.bmi}</div>
              <div className={`stat-desc text-sm font-semibold ${bmiColor(latest.bmi)}`}>{bmiLabel(latest.bmi)}</div>
            </div>
          </div>
        </div>
      )}

      {metrics.length >= 2 && <MetricsChart metrics={metrics} />}

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card card-compact bg-base-100 border border-base-300">
          <div className="card-body gap-4">
            <h3 className="font-semibold text-sm">Pengukuran Baru</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Berat (kg)", key: "weight", inputMode: "decimal", step: "0.1", placeholder: "84.5", required: true },
                { label: "Pinggang (cm)", key: "waist", inputMode: "decimal", step: "0.5", placeholder: "98", required: true },
                { label: "Tinggi (cm)", key: "height", inputMode: "decimal", step: "1", placeholder: "173" },
              ].map(({ label, key, inputMode, step, placeholder, required }) => (
                <div key={key} className="form-control">
                  <label className="label py-0 mb-1">
                    <span className="label-text text-xs text-base-content/60">{label}</span>
                  </label>
                  <input
                    type="number"
                    inputMode={inputMode}
                    step={step}
                    required={required}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="input input-bordered input-sm"
                  />
                </div>
              ))}
              <div className="form-control">
                <label className="label py-0 mb-1">
                  <span className="label-text text-xs text-base-content/60">Tanggal</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="input input-bordered input-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving || !form.weight || !form.waist}
              className="btn btn-primary btn-block btn-sm"
            >
              {saving ? <span className="loading loading-spinner loading-xs" /> : <FiCheck size={15} />}
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* History */}
      {metrics.length > 0 && (
        <div>
          <p className="text-xs font-medium text-base-content/55 uppercase tracking-wider mb-3">Riwayat</p>
          <div className="card bg-base-100 border border-base-300">
            <div className="divide-y divide-base-300">
              {metrics.map((m) => (
                <div key={m._id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{formatDate(m.date)}</p>
                    <p className="text-xs text-base-content/55 mt-0.5">
                      {m.weight} kg · {m.waist} cm · BMI {m.bmi}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMetric(m._id)}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {metrics.length === 0 && !showForm && (
        <div className="text-center py-12 text-base-content/50 text-sm">
          Belum ada data. Catat pengukuran pertama lo!
        </div>
      )}
    </div>
  );
}
