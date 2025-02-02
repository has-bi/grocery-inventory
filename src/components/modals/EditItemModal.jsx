"use client";
import { useState, useEffect } from "react";

export default function EditItemModal({ isOpen, onClose, onSubmit, item }) {
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    satuan: "",
    jumlah: "",
    tanggal_kadaluarsa: "",
  });

  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        nama: item.nama || "",
        kategori: item.kategori || "",
        satuan: item.satuan || "",
        jumlah: item.jumlah || "",
        tanggal_kadaluarsa: item.tanggal_kadaluarsa || "",
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

        <div className="relative bg-white w-full max-w-lg rounded-lg p-6">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">Edit Item</h3>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Item
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.kategori}
                onChange={(e) =>
                  setFormData({ ...formData, kategori: e.target.value })
                }
                required
              >
                <option value="">Pilih kategori</option>
                <option value="Buah">Buah</option>
                <option value="Sayuran">Sayuran</option>
                <option value="Daging">Daging</option>
                <option value="Susu">Susu</option>
                <option value="Bahan Makanan">Bahan Makanan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Satuan
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.satuan}
                onChange={(e) =>
                  setFormData({ ...formData, satuan: e.target.value })
                }
                required
              >
                <option value="">Pilih satuan</option>
                <option value="kilogram">Kilogram</option>
                <option value="gram">Gram</option>
                <option value="liter">Liter</option>
                <option value="mililiter">Mililiter</option>
                <option value="pcs">Pcs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jumlah
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.jumlah}
                onChange={(e) =>
                  setFormData({ ...formData, jumlah: Number(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Kadaluarsa (Opsional)
              </label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tanggal_kadaluarsa}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tanggal_kadaluarsa: e.target.value,
                  })
                }
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
