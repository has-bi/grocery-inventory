"use client";
import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import InventoryTable from "@/components/InventoryTable";
import InventoryStats from "@/components/InventoryStats";
import CatalogView from "@/components/grocery/CatalogView";
import AddItemModal from "@/components/modals/AddItemModal";
import EditItemModal from "@/components/modals/EditItemModal";
import NotificationButton from "@/components/NotificationButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { FiSearch, FiPlus } from "react-icons/fi";

const TABS = [
  { key: "stok", label: "Stok" },
  { key: "katalog", label: "Katalog" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("stok");

  const {
    items,
    allItems,
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
    refresh,
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
    if (result.success) setIsAddModalOpen(false);
    else alert("Gagal menambah item: " + result.error);
  };

  const handleUpdateItem = async (formData) => {
    if (!editingItem) return;
    const result = await updateItem(editingItem._id, formData);
    if (result.success) {
      setIsEditModalOpen(false);
      setEditingItem(null);
    } else {
      alert("Gagal update item: " + result.error);
    }
  };

  const handleDeleteItem = async (id) => {
    const result = await deleteItem(id);
    if (!result.success) alert("Gagal menghapus item: " + result.error);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex justify-between items-center gap-3 mb-5 sm:mb-6">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-light text-black">Grocery</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
            Pantau stok & kesegaran bahan makanan
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <NotificationButton />
          {activeTab === "stok" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5 text-sm"
            >
              <FiPlus size={16} />
              Tambah
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stok tab */}
      {activeTab === "stok" && (
        <>
          <div className="mb-6">
            <InventoryStats items={allItems} />
          </div>

          {/* Category filter pills */}
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="mb-4">
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
              <div className="text-center text-red-600 py-12">Error: {error}</div>
            ) : (
              <InventoryTable
                items={items}
                sortConfig={sortConfig}
                requestSort={requestSort}
                onEdit={handleEditClick}
                onDelete={handleDeleteItem}
                onQuickUpdate={quickUpdate}
              />
            )}
          </div>
        </>
      )}

      {/* Katalog tab */}
      {activeTab === "katalog" && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <CatalogView onRestockDone={() => { setActiveTab("stok"); refresh(); }} />
        </div>
      )}

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddItem}
      />
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingItem(null); }}
        onSubmit={handleUpdateItem}
        item={editingItem}
      />
    </div>
  );
}
