"use client";
import { useState, useEffect } from "react";
import { catalogApi, groceryApi } from "@/actions/sheets";

export function useCatalog({ onRestockDone } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Shopping mode state: map of _id → qty string
  const [isShopping, setIsShopping] = useState(false);
  const [checked, setChecked] = useState({});
  const [restockSuccess, setRestockSuccess] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await catalogApi.getAll();
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (payload) => {
    try {
      await catalogApi.add(payload);
      await fetchItems();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateItem = async (id, payload) => {
    try {
      await catalogApi.update(id, payload);
      await fetchItems();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteItem = async (id) => {
    try {
      await catalogApi.delete(id);
      await fetchItems();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const startShopping = () => {
    // Pre-check all items with their default quantities
    const initial = {};
    items.forEach((item) => {
      initial[item._id] = item.jumlah_default || "1";
    });
    setChecked(initial);
    setIsShopping(true);
  };

  const cancelShopping = () => {
    setIsShopping(false);
    setChecked({});
  };

  const toggleItem = (id, defaultQty) => {
    setChecked((prev) => {
      const next = { ...prev };
      if (id in next) {
        delete next[id];
      } else {
        next[id] = defaultQty || "1";
      }
      return next;
    });
  };

  const setItemQty = (id, qty) => {
    setChecked((prev) => ({ ...prev, [id]: qty }));
  };

  const confirmShopping = async () => {
    const selectedIds = Object.keys(checked);
    if (selectedIds.length === 0) return;
    setSaving(true);
    try {
      const selectedItems = items.filter((item) => selectedIds.includes(item._id));
      await Promise.all(
        selectedItems.map((item) =>
          groceryApi.upsertByName({
            nama: item.nama,
            kategori: item.kategori,
            satuan: item.satuan,
            jumlah: checked[item._id],
            lokasi: item.lokasi || "",
          })
        )
      );
      setRestockSuccess(true);
      setIsShopping(false);
      setChecked({});
      setTimeout(() => {
        setRestockSuccess(false);
        if (onRestockDone) onRestockDone();
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const checkedCount = Object.keys(checked).length;

  return {
    items,
    loading,
    saving,
    error,
    isShopping,
    checked,
    checkedCount,
    restockSuccess,
    addItem,
    updateItem,
    deleteItem,
    startShopping,
    cancelShopping,
    toggleItem,
    setItemQty,
    confirmShopping,
  };
}
