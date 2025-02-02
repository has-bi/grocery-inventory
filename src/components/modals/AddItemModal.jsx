import { useState } from "react";

// This is our popup form for adding new items
// isOpen: tells us if we should show the form
// onClose: function to run when we close the form
// onSubmit: function to run when we submit the form
export default function AddItemModal({ isOpen, onClose, onSubmit }) {
  // If the form isn't supposed to be open, don't show anything
  if (!isOpen) return null;

  // Create a box to store our form data
  // Think of this like a paper form where we'll write down all the details
  const [formData, setFormData] = useState({
    nama: "", // Name of item
    kategori: "", // Category (like fruit, vegetable, etc)
    satuan: "", // Unit (kg, liter, etc)
    jumlah: "", // Quantity
    tanggal_kadaluarsa: "", // Expiry date
  });

  // When someone submits the form
  // Like when you're done filling out a paper form and hand it in
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the page from reloading
    onSubmit(formData); // Send the form data to be processed
  };

  // The actual form that shows up on screen
  return (
    // This makes our form float over everything else
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Center everything on screen */}
      <div className="flex min-h-screen items-center justify-center px-4">
        {/* Dark overlay behind the form */}
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

        {/* The white form container */}
        <div className="relative bg-white w-full max-w-lg rounded-lg p-6">
          {/* Close button (X) in top right */}
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>

          {/* The actual form with all our input fields */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Name input field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Item
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={formData.nama}
                // When someone types, update our form data
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
              />
            </div>

            {/* Category dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
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

            {/* Unit dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Satuan
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
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

            {/* Quantity input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jumlah
              </label>
              <input
                type="number"
                min="0" // Can't have negative quantity
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={formData.jumlah}
                onChange={(e) =>
                  setFormData({ ...formData, jumlah: e.target.value })
                }
                required
              />
            </div>

            {/* Expiry date input (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Kadaluarsa (Opsional)
              </label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={formData.tanggal_kadaluarsa}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tanggal_kadaluarsa: e.target.value,
                  })
                }
              />
            </div>

            {/* Buttons at the bottom */}
            <div className="mt-6 flex justify-end space-x-3">
              {/* Cancel button */}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Batal
              </button>
              {/* Submit button */}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Tambah
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
