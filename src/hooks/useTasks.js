"use client";
import { useState, useEffect, useMemo } from "react";
import { tasksApi } from "@/actions/sheets";
import { getProduktivitasScore } from "@/lib/taskEngine";

function getTodayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useTasks() {
  const today = getTodayDate();
  const [tasks, setTasks] = useState([]);
  const [taskLogs, setTaskLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [t, l] = await Promise.all([tasksApi.getAll(), tasksApi.getLogs()]);
      setTasks(t);
      setTaskLogs(l);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const todayLogs = useMemo(
    () => taskLogs.filter((l) => l.completedDate === today),
    [taskLogs, today]
  );

  const produktivitasScore = useMemo(
    () => getProduktivitasScore(tasks, taskLogs, today),
    [tasks, taskLogs, today]
  );

  const addTask = async (payload) => {
    const result = await tasksApi.add({ ...payload, active: "true", lastDone: "", createdAt: today });
    if (result.success) await fetchAll();
    return result;
  };

  const updateTask = async (id, payload) => {
    const result = await tasksApi.update(id, payload);
    if (result.success) await fetchAll();
    return result;
  };

  const deleteTask = async (id) => {
    const result = await tasksApi.delete(id);
    if (result.success) setTasks((prev) => prev.filter((t) => t._id !== id));
    return result;
  };

  const completeTask = async (taskId) => {
    const tempLog = { _id: `temp_${Date.now()}`, taskId, completedDate: today };
    setTaskLogs((prev) => [...prev, tempLog]);
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, lastDone: today } : t)));
    try {
      await tasksApi.complete(taskId, today);
    } catch (err) {
      await fetchAll();
      setError(err.message);
    }
  };

  const uncompleteTask = async (taskId) => {
    setTaskLogs((prev) => prev.filter((l) => !(l.taskId === taskId && l.completedDate === today)));
    try {
      await tasksApi.uncomplete(taskId, today);
      const updated = await tasksApi.getAll();
      setTasks(updated);
    } catch (err) {
      await fetchAll();
      setError(err.message);
    }
  };

  return {
    tasks,
    taskLogs,
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
  };
}
