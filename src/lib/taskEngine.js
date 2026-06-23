export const CATEGORIES = {
  cekat:     { label: "Cekat.AI",    chipClass: "bg-blue-100 text-blue-800 border-blue-200",    activeClass: "bg-blue-700 text-white border-blue-700" },
  revou:     { label: "RevoU",       chipClass: "bg-purple-100 text-purple-800 border-purple-200", activeClass: "bg-purple-700 text-white border-purple-700" },
  altrabyte: { label: "AltraByte",   chipClass: "bg-cyan-100 text-cyan-800 border-cyan-200",    activeClass: "bg-cyan-700 text-white border-cyan-700" },
  abay:      { label: "Abay Coffee", chipClass: "bg-amber-100 text-amber-800 border-amber-200", activeClass: "bg-amber-700 text-white border-amber-700" },
  outly:     { label: "Outly",       chipClass: "bg-rose-100 text-rose-800 border-rose-200",    activeClass: "bg-rose-700 text-white border-rose-700" },
  rutinitas: { label: "Rutinitas",   chipClass: "bg-gray-100 text-gray-700 border-gray-200",    activeClass: "bg-gray-700 text-white border-gray-700" },
};

export const CATEGORY_WEIGHTS = {
  cekat: 1.5, revou: 1.0, altrabyte: 1.0, abay: 1.0, outly: 1.0, rutinitas: 0.8,
};

export const TASK_TYPES = {
  habit: "Habit",
  rutin: "Rutin",
  tugas: "Tugas",
};

function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function isDueToday(task, today) {
  if (!task.active) return false;
  if (task.type === "habit") return true;
  if (task.type === "tugas") return !task.deadline || task.deadline >= today;
  if (task.type === "rutin") {
    const days = JSON.parse(task.dayOfWeek || "[]");
    if (days.length > 0) return days.includes(new Date(today + "T00:00:00").getDay());
    if (!task.lastDone) return true;
    const next = new Date(task.lastDone + "T00:00:00");
    next.setDate(next.getDate() + (parseInt(task.interval) || 1));
    return dateStr(next) <= today;
  }
  return false;
}

export function isOverdue(task, today) {
  return task.type === "tugas" && !!task.deadline && task.deadline < today;
}

export function isCompletedToday(taskId, todayLogs) {
  return todayLogs.some((l) => l.taskId === taskId);
}

export function getProduktivitasScore(tasks, taskLogs, today) {
  const todayLogs = taskLogs.filter((l) => l.completedDate === today);
  const completedIds = new Set(todayLogs.map((l) => l.taskId));
  const active = tasks.filter((t) => t.active);

  const habits = active.filter((t) => t.type === "habit");
  const habitsDone = habits.filter((t) => completedIds.has(t._id)).length;

  let score = 50;
  score += Math.min(habitsDone * 10, 30);
  if (habits.length > 0 && habitsDone >= habits.length) score += 10;

  active
    .filter((t) => t.type !== "habit" && completedIds.has(t._id))
    .forEach((t) => {
      score += Math.round(10 * (CATEGORY_WEIGHTS[t.category] || 1.0));
    });

  active
    .filter((t) => isOverdue(t, today) && !completedIds.has(t._id))
    .forEach(() => {
      score -= 10;
    });

  return Math.max(0, Math.min(100, Math.round(score)));
}
