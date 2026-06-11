"use client";
import { useState } from "react";
import { FiEdit2, FiTrash2, FiShoppingCart, FiPlus, FiCheck } from "react-icons/fi";
import { useCatalog } from "@/hooks/useCatalog";
import CatalogItemModal from "@/components/modals/CatalogItemModal";

const LOKASI_COLORS = {
  Kulkas: "bg-blue-100 text-blue-700",
  Freezer: "bg-cyan-100 text-cyan-700",
  Rak: "bg-amber-100 text-amber-700",
  Lemari: "bg-purple-100 text-purple-700",
};

export default function CatalogView({ onRestockDone }) {
  const {
    items, loading, saving, error,
    isShopping, checked, checkedCount, restockSuccess,
    addItem, updateItem, deleteItem,
    startShopping, cancelShopping,
    toggleItem, setItemQty, confirmShopping,
  } = useCatalog({ onRestockDone });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const handleSubmit = async (formData) => {
    const result = editingItem
      ? await updateItem(editingItem._id, formData)
      : await addItem(formData);
    if (result.success) {
      setModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    setConfirmId(null);
    await deleteItem(id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <span className="loading loading-spinner loading-lg text-black"></span>
        <p className="text-sm text-gray-500">Memuat katalog...</p>
      </div>
    );
  }

  // Success banner
  if (restockSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <FiCheck size={28} className="text-green-700" />
        </div>
        <p className="text-base font-medium text-black">Stok berhasil diperbarui!</p>
        <p className="text-sm text-gray-500">Item belanjaan sudah masuk ke inventori.</p>
      </div>
    );
  }

  // Shopping mode
  if (isShopping) {
    return (
      <div>
        <div className="mb-5">
          <h3 className="text-sm font-medium text-black">Pilih yang kamu beli hari ini</h3>
          <p className="text-xs text-gray-500 mt-0.5">Centang item & sesuaikan jumlahnya jika perlu</p>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">Katalog kosong.</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {items.map((item) => {
              const isChecked = item._id in checked;
              return (
                <li
                  key={item._id}
                  onClick={() => toggleItem(item._id, item.jumlah_default)}
                  className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors select-none ${
                    isChecked
                      ? "border-black bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isChecked ? "bg-black border-black" : "border-gray-300"
                  }`}>
                    {isChecked && <FiCheck size={12} className="text-white" />}
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isChecked ? "text-black" : "text-gray-700"}`}>
                      {item.nama}
                    </p>
                    <p className="text-xs text-gray-500">{item.kategori}</p>
                  </div>

                  {/* Quantity input (only when checked) */}
                  {isChecked && (
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={checked[item._id]}
                        onChange={(e) => setItemQty(item._id, e.target.value)}
                        className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-base sm:text-sm text-black text-center focus:outline-none focus:border-black"
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">{item.satuan}</span>
                    </div>
                  )}

                  {/* Default qty hint when not checked */}
                  {!isChecked && (
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {item.jumlah_default} {item.satuan}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex gap-3">
          <button
            onClick={cancelShopping}
            className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:border-gray-400 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={confirmShopping}
            disabled={checkedCount === 0 || saving}
            className="flex-1 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Menyimpan..." : `Selesai Belanja${checkedCount > 0 ? ` (${checkedCount})` : ""}`}
          </button>
        </div>
      </div>
    );
  }

  // Browse mode
  return (
    <div>
      {error && (
        <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>
      )}

      {/* Header actions */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-gray-700 font-medium">
            {items.length} item reguler
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Item yang sering kamu beli</p>
        </div>
        <div className="flex gap-2">
          {items.length > 0 && (
            <button
              onClick={startShopping}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 text-sm text-gray-700 rounded-lg hover:border-black hover:text-black transition-colors"
            >
              <FiShoppingCart size={15} />
              Belanja
            </button>
          )}
          <button
            onClick={() => { setEditingItem(null); setModalOpen(true); }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiPlus size={15} />
            Tambah
          </button>
        </div>
      </div>

      {/* Catalog list */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 mb-1">Katalog masih kosong.</p>
          <p className="text-xs text-gray-400">Tambahkan item yang sering kamu beli.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item._id} className="py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-black font-medium truncate">{item.nama}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-500">{item.kategori}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-600 font-medium">
                    {item.jumlah_default} {item.satuan}
                  </span>
                  {item.lokasi && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LOKASI_COLORS[item.lokasi] || "bg-gray-100 text-gray-600"}`}>
                      {item.lokasi}
                    </span>
                  )}
                </div>
              </div>

              {confirmId === item._id ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-gray-500">Hapus?</span>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded hover:border-gray-400 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
                    aria-label={`Edit ${item.nama}`}
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    onClick={() => setConfirmId(item._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                    aria-label={`Hapus ${item.nama}`}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <CatalogItemModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingItem(null); }}
        onSubmit={handleSubmit}
        item={editingItem}
      />
    </div>
  );
}
