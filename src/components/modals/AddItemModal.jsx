import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";

const CATEGORIES = [
  "Sayuran",
  "Buah",
  "Daging & Ikan",
  "Telur & Susu",
  "Bahan Masakan",
  "Bumbu & Rempah",
  "Minuman",
  "Frozen & Olahan",
  "Snack & Camilan",
  "Lainnya",
];

const UNITS = ["kg", "gram", "liter", "ml", "pcs", "bungkus", "botol", "kaleng", "ikat", "butir", "sachet", "loyang"];

const LOKASI = ["Kulkas", "Freezer", "Rak", "Lemari"];

const FIELD = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base sm:text-sm text-black focus:outline-none focus:border-black transition-colors bg-white";
const LABEL = "block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5";

export default function AddItemModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    satuan: "",
    jumlah: "",
    lokasi: "",
    tanggal_kadaluarsa: "",
  });

  const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ nama: "", kategori: "", satuan: "", jumlah: "", lokasi: "", tanggal_kadaluarsa: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>Tambah Item Baru</ModalHeader>
        <ModalBody>
          <div>
            <label className={LABEL}>Nama Item</label>
            <input
              type="text"
              placeholder="Contoh: Ayam Kampung"
              value={formData.nama}
              onChange={set("nama")}
              required
              autoFocus
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL}>Kategori</label>
            <select value={formData.kategori} onChange={set("kategori")} required className={FIELD}>
              <option value="" disabled>Pilih kategori...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Jumlah</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                step="any"
                value={formData.jumlah}
                onChange={set("jumlah")}
                required
                className={FIELD}
              />
            </div>
            <div>
              <label className={LABEL}>Satuan</label>
              <select value={formData.satuan} onChange={set("satuan")} required className={FIELD}>
                <option value="" disabled>Pilih...</option>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>
                Lokasi Simpan <span className="normal-case text-gray-400 font-normal">(opsional)</span>
              </label>
              <select value={formData.lokasi} onChange={set("lokasi")} className={FIELD}>
                <option value="">-</option>
                {LOKASI.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>
                Kadaluarsa <span className="normal-case text-gray-400 font-normal">(opsional)</span>
              </label>
              <input
                type="date"
                value={formData.tanggal_kadaluarsa}
                onChange={set("tanggal_kadaluarsa")}
                className={FIELD}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-gray-600 hover:text-black transition-colors">
            Batal
          </button>
          <button
            type="submit"
            disabled={!formData.nama || !formData.kategori || !formData.jumlah || !formData.satuan}
            className="px-5 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Tambah Item
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
