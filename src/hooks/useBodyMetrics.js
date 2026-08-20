"use client";
import { useState, useEffect, useMemo } from "react";
import { bodyApi } from "@/actions/sheets";

function calcBMI(weight, height) {
  if (!weight || !height) return 0;
  return Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;
}

function getLocalToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useBodyMetrics() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchMetrics(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await bodyApi.getAll();
      setMetrics(data.sort((a, b) => b.date.localeCompare(a.date)));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const latest = useMemo(() => metrics[0] ?? null, [metrics]);

  const addMetric = async ({ date, weight, waist, height }) => {
    const bmi = calcBMI(parseFloat(weight), parseFloat(height));
    const payload = {
      date: date || getLocalToday(),
      weight: String(weight),
      waist: String(waist),
      height: String(height || 173),
      bmi: String(bmi),
    };
    const result = await bodyApi.add(payload);
    if (result.success) {
      await fetchMetrics();
    }
    return result;
  };

  const deleteMetric = async (id) => {
    setMetrics((prev) => prev.filter((m) => m._id !== id));
    try {
      await bodyApi.delete(id);
    } catch (err) {
      await fetchMetrics();
      setError(err.message);
    }
  };

  return { loading, error, metrics, latest, addMetric, deleteMetric };
}
