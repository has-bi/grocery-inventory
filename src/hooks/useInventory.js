import { useState, useEffect, useMemo } from "react";
import { groceryApi as api } from "@/actions/sheets";

export function useInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
      await api.addItem(itemData);
      await fetchItems();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      await api.updateItem(id, itemData);
      await fetchItems();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.deleteItem(id);
      await fetchItems();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const processedItems = useMemo(() => {
    let result = [...items];

    // Filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.nama.toLowerCase().includes(lowerQuery) ||
          item.kategori.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [items, searchQuery, sortConfig]);

  return {
    items: processedItems,
    allItems: items, // Useful for stats
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    addItem,
    updateItem,
    deleteItem,
    refresh: fetchItems,
  };
}
