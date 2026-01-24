"use client";
import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import InventoryTable from "@/components/InventoryTable";
import InventoryStats from "@/components/InventoryStats";
import AddItemModal from "@/components/modals/AddItemModal";
import EditItemModal from "@/components/modals/EditItemModal";
import { Input, Button, Spinner } from "@heroui/react";
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
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl space-y-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Isi Kulkas
            </h1>
            <p className="text-gray-600 mt-1">
              Pantau kesegaran bahan makananmu
            </p>
          </div>
          <Button
            color="primary"
            endContent={<FiPlus />}
            onPress={() => setIsAddModalOpen(true)}
            className="font-medium"
          >
            Tambah Barang
          </Button>
        </div>

        {/* Stats Section */}
        <InventoryStats items={allItems} />

        {/* Search and Table Section */}
        <div className="space-y-4">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Cari barang atau kategori..."
              startContent={<FiSearch className="text-gray-500" />}
              value={searchQuery}
              onValueChange={setSearchQuery}
              isClearable
              onClear={() => setSearchQuery("")}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner label="Loading items..." color="primary" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                Error: {error}
              </div>
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
        </div>
      </div>

      {/* Modals */}
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
