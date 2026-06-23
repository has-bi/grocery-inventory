"use client";
import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { CATEGORIES, CATEGORY_WEIGHTS, TASK_TYPES } from "@/lib/taskEngine";

const FIELD = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base sm:text-sm text-black focus:outline-none focus:border-black transition-colors bg-white";
const LABEL = "block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5";

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const EMPTY_FORM = {
  title: "",
  type: "habit",
  category: "rutinitas",
  recurMode: "interval",
  interval: "1",
  dayOfWeek: [],
  deadline: "",
};

function formFromTask(task) {
  if (!task) return EMPTY_FORM;
  const parsedDays = (() => {
    try { return JSON.parse(task.dayOfWeek || "[]"); } catch { return []; }
  })();
  return {
    title: task.title || "",
    type: task.type || "habit",
    category: task.category || "rutinitas",
    recurMode: parsedDays.length > 0 ? "days" : "interval",
    interval: task.interval || "1",
    dayOfWeek: parsedDays,
    deadline: task.deadline || "",
  };
}

export default function AddTaskModal({ isOpen, onClose, onSubmit, onDelete, task }) {
  const isEdit = !!task;
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(formFromTask(task));
      setSubmitting(false);
      setDeleting(false);
    }
  }, [isOpen, task]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      dayOfWeek: prev.dayOfWeek.includes(day)
        ? prev.dayOfWeek.filter((d) => d !== day)
        : [...prev.dayOfWeek, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title: form.title,
      type: form.type,
      category: form.category,
      interval: form.type === "rutin" && form.recurMode === "interval" ? String(form.interval) : "",
      dayOfWeek: form.type === "rutin" && form.recurMode === "days" ? JSON.stringify(form.dayOfWeek) : "[]",
      deadline: form.type === "tugas" ? form.deadline : "",
      weight: String(CATEGORY_WEIGHTS[form.category] || 1.0),
    };
    const result = await onSubmit(payload);
    setSubmitting(false);
    if (result?.success) onClose();
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    await onDelete();
    setDeleting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>{isEdit ? "Edit Task" : "Tambah Task"}</ModalHeader>
        <ModalBody>
          <div>
            <label className={LABEL}>Judul</label>
            <input
              type="text"
              placeholder="Nama task..."
              value={form.title}
              onChange={set("title")}
              required
              autoFocus
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL}>Tipe</label>
            <div className="flex gap-2">
              {Object.entries(TASK_TYPES).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: key }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.type === key
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={LABEL}>Kategori</label>
            <select value={form.category} onChange={set("category")} className={FIELD}>
              {Object.entries(CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {form.type === "rutin" && (
            <div>
              <label className={LABEL}>Pengulangan</label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, recurMode: "interval" }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.recurMode === "interval"
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  Setiap N hari
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, recurMode: "days" }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.recurMode === "days"
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  Hari tertentu
                </button>
              </div>

              {form.recurMode === "interval" && (
                <div>
                  <label className={LABEL}>Interval (hari)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.interval}
                    onChange={set("interval")}
                    className={FIELD}
                  />
                </div>
              )}

              {form.recurMode === "days" && (
                <div>
                  <label className={LABEL}>Hari</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {DAY_LABELS.map((label, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          form.dayOfWeek.includes(idx)
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {form.type === "tugas" && (
            <div>
              <label className={LABEL}>
                Deadline <span className="normal-case text-gray-400 font-normal">(opsional)</span>
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={set("deadline")}
                className={FIELD}
              />
            </div>
          )}
        </ModalBody>

        <ModalFooter className={isEdit ? "justify-between" : ""}>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2.5 text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-40"
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </button>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-black transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!form.title || submitting}
              className="px-5 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
            </button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
