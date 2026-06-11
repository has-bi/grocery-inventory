"use client";
import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import InventoryTable from "@/components/InventoryTable";
import InventoryStats from "@/components/InventoryStats";
import AddItemModal from "@/components/modals/AddItemModal";
import EditItemModal from "@/components/modals/EditItemModal";
import NotificationButton from "@/components/NotificationButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { FiSearch, FiPlus } from "react-icons/fi";

export default function Home() {
  const {
    items,
    allItems,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    addItem,
    updateItem,
    deleteItem,
  } = useInventory();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleAddItem = async (formData) => {
    const result = await addItem(formData);
    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      alert("Failed to add item: " + result.error);
    }
  };

  const handleUpdateItem = async (formData) => {
    if (!editingItem) return;
    const result = await updateItem(editingItem._id, formData);
    if (result.success) {
      setIsEditModalOpen(false);
      setEditingItem(null);
    } else {
      alert("Failed to update item: " + result.error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      const result = await deleteItem(id);
      if (!result.success) {
        alert("Failed to delete item: " + result.error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-black">Grocery</h2>
            <p className="text-sm text-gray-400 mt-0.5">Pantau stok & kesegaran bahan makanan</p>
          </div>
          <div className="flex gap-3">
            <NotificationButton />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
            >
              <FiPlus size={16} />
              Tambah
            </button>
          </div>
        </div>

        <InventoryStats items={allItems} />
      </div>

      <div className="mb-5">
        <SearchInput
          placeholder="Cari barang atau kategori..."
          icon={<FiSearch className="text-gray-400" />}
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-3">
            <span className="loading loading-spinner loading-lg text-black"></span>
            <p className="text-sm text-gray-500">Loading items...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">Error: {error}</div>
        ) : (
          <InventoryTable
            items={items}
            sortConfig={sortConfig}
            requestSort={requestSort}
            onEdit={handleEditClick}
            onDelete={handleDeleteItem}
          />
        )}
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddItem}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleUpdateItem}
        item={editingItem}
      />
    </div>
  );
}
