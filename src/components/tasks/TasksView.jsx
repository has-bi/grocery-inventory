"use client";
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useHealthTracker } from "@/hooks/useHealthTracker";
import { CATEGORIES, TASK_TYPES, isDueToday, isOverdue, isCompletedToday } from "@/lib/taskEngine";
import AddTaskModal from "@/components/tasks/AddTaskModal";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function TaskSubtext({ task, today }) {
  if (task.type === "habit") {
    return <span className="text-xs text-gray-400">Setiap hari</span>;
  }
  if (task.type === "rutin") {
    const days = (() => { try { return JSON.parse(task.dayOfWeek || "[]"); } catch { return []; } })();
    if (days.length > 0) {
      return <span className="text-xs text-gray-400">{days.map((d) => DAY_NAMES[d]).join(", ")}</span>;
    }
    return <span className="text-xs text-gray-400">Setiap {task.interval || 1} hari</span>;
  }
  if (task.type === "tugas") {
    if (!task.deadline) return null;
    const overdue = isOverdue(task, today);
    return (
      <span className={`text-xs ${overdue ? "text-red-500" : "text-gray-400"}`}>
        Deadline {formatDate(task.deadline)}
      </span>
    );
  }
  return null;
}

function CategoryPill({ category }) {
  const cat = CATEGORIES[category];
  if (!cat) return null;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${cat.chipClass}`}>
      {cat.label}
    </span>
  );
}

function TaskRowToday({ task, today, completed, onToggle }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <button
        type="button"
        onClick={() => onToggle(task._id)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
          completed
            ? "bg-black border-black"
            : "border-gray-300 hover:border-gray-500"
        }`}
        aria-label={completed ? "Tandai belum selesai" : "Tandai selesai"}
      >
        {completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${completed ? "line-through text-gray-400" : "text-black"}`}>
          {task.title}
        </p>
        <TaskSubtext task={task} today={today} />
      </div>
      <CategoryPill category={task.category} />
    </div>
  );
}

function ScoreBanner({ healthScore, healthLoading, produktivitasScore }) {
  const lifeScore = healthLoading ? null : Math.round((healthScore + produktivitasScore) / 2);

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-500 mb-1">Kesehatan</p>
        <p className="text-2xl font-semibold text-black">
          {healthLoading ? "—" : healthScore}
        </p>
      </div>
      <div className="bg-black rounded-xl p-3 text-center">
        <p className="text-xs text-gray-400 mb-1">Life Score</p>
        <p className="text-2xl font-semibold text-white">
          {lifeScore === null ? "—" : lifeScore}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-500 mb-1">Produktivitas</p>
        <p className="text-2xl font-semibold text-black">{produktivitasScore}</p>
      </div>
    </div>
  );
}

export default function TasksView() {
  const {
    tasks,
    todayLogs,
    loading,
    error,
    today,
    produktivitasScore,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
  } = useTasks();

  const { score: healthScore, loading: healthLoading } = useHealthTracker();

  const [activeTab, setActiveTab] = useState("today");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleToggle = (taskId) => {
    const done = todayLogs.some((l) => l.taskId === taskId);
    if (done) {
      uncompleteTask(taskId);
    } else {
      completeTask(taskId);
    }
  };

  const handleAddSubmit = async (payload) => {
    return await addTask(payload);
  };

  const handleEditSubmit = async (payload) => {
    return await updateTask(editingTask._id, payload);
  };

  const handleDelete = async () => {
    if (editingTask) await deleteTask(editingTask._id);
  };

  const openAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const activeTasks = tasks.filter((t) => t.active);
  const habitTasks = activeTasks.filter((t) => t.type === "habit");
  const rutinTasks = activeTasks.filter((t) => t.type === "rutin" && isDueToday(t, today));
  const tugasTasks = activeTasks
    .filter((t) => t.type === "tugas" && isDueToday(t, today))
    .sort((a, b) => {
      const aOver = isOverdue(a, today) ? 0 : 1;
      const bOver = isOverdue(b, today) ? 0 : 1;
      if (aOver !== bOver) return aOver - bOver;
      if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return 0;
    });

  const tasksByCategory = Object.keys(CATEGORIES).reduce((acc, cat) => {
    const catTasks = activeTasks.filter((t) => t.category === cat);
    if (catTasks.length > 0) acc[cat] = catTasks;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Memuat...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <ScoreBanner
        healthScore={healthScore}
        healthLoading={healthLoading}
        produktivitasScore={produktivitasScore}
      />

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("today")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "today" ? "bg-white text-black shadow-sm" : "text-gray-500"
          }`}
        >
          Hari Ini
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "all" ? "bg-white text-black shadow-sm" : "text-gray-500"
          }`}
        >
          Semua
        </button>
      </div>

      {activeTab === "today" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-700">
              {new Date(today + "T00:00:00").toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long",
              })}
            </h2>
            <button
              onClick={openAdd}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors text-lg leading-none"
              aria-label="Tambah task"
            >
              +
            </button>
          </div>

          {habitTasks.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Habit</p>
              <div className="divide-y divide-gray-100">
                {habitTasks.map((task) => (
                  <TaskRowToday
                    key={task._id}
                    task={task}
                    today={today}
                    completed={isCompletedToday(task._id, todayLogs)}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {rutinTasks.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Rutin</p>
              <div className="divide-y divide-gray-100">
                {rutinTasks.map((task) => (
                  <TaskRowToday
                    key={task._id}
                    task={task}
                    today={today}
                    completed={isCompletedToday(task._id, todayLogs)}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {tugasTasks.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tugas</p>
              <div className="divide-y divide-gray-100">
                {tugasTasks.map((task) => (
                  <TaskRowToday
                    key={task._id}
                    task={task}
                    today={today}
                    completed={isCompletedToday(task._id, todayLogs)}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {habitTasks.length === 0 && rutinTasks.length === 0 && tugasTasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              Tidak ada task untuk hari ini.
              <br />
              <button onClick={openAdd} className="mt-2 text-black underline text-sm">
                Tambah task pertama
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "all" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-700">Semua Task</h2>
            <button
              onClick={openAdd}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors text-lg leading-none"
              aria-label="Tambah task"
            >
              +
            </button>
          </div>

          {Object.entries(tasksByCategory).map(([cat, catTasks]) => (
            <div key={cat} className="mb-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                {CATEGORIES[cat].label}
              </p>
              <div className="divide-y divide-gray-100">
                {catTasks.map((task) => (
                  <div key={task._id} className="flex items-center gap-3 py-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-black">{task.title}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 bg-gray-50">
                          {TASK_TYPES[task.type] || task.type}
                        </span>
                      </div>
                      <TaskSubtext task={task} today={today} />
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(task)}
                      className="text-xs text-gray-400 hover:text-black transition-colors px-2 py-1 shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {activeTasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              Belum ada task.
              <br />
              <button onClick={openAdd} className="mt-2 text-black underline text-sm">
                Tambah task pertama
              </button>
            </div>
          )}
        </div>
      )}

      <AddTaskModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleEditSubmit : handleAddSubmit}
        onDelete={editingTask ? handleDelete : undefined}
        task={editingTask}
      />
    </div>
  );
}
