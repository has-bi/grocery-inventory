import { useState, useEffect, useMemo } from "react";
import { groceryApi as api } from "@/actions/sheets";

export function useInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemData) => {
    try {
      await api.add(itemData);
      await fetchItems();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      await api.update(id, itemData);
      await fetchItems();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(id);
      await fetchItems();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const quickUpdate = async (id, newJumlah) => {
    const clamped = Math.max(0, newJumlah);
    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, jumlah: String(clamped) } : item
      )
    );
    try {
      await api.update(id, { jumlah: String(clamped) });
    } catch (err) {
      setError(err.message);
      await fetchItems();
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const categories = useMemo(() => {
    const cats = [...new Set(items.map((i) => i.kategori).filter(Boolean))].sort();
    return ["Semua", ...cats];
  }, [items]);

  const processedItems = useMemo(() => {
    let result = [...items];

    if (categoryFilter !== "Semua") {
      result = result.filter((item) => item.kategori === categoryFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.nama?.toLowerCase().includes(q) ||
          item.kategori?.toLowerCase().includes(q)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [items, searchQuery, categoryFilter, sortConfig]);

  return {
    items: processedItems,
    allItems: items,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    categories,
    sortConfig,
    requestSort,
    addItem,
    updateItem,
    deleteItem,
    quickUpdate,
    refresh: fetchItems,
  };
}
