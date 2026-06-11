import { useState, useRef, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";

const CATEGORIES = [
  "Sayuran", "Buah", "Daging & Ikan", "Telur & Susu",
  "Bahan Masakan", "Bumbu & Rempah", "Minuman",
  "Frozen & Olahan", "Snack & Camilan", "Lainnya",
];
const UNITS = ["kg", "gram", "liter", "ml", "pcs", "bungkus", "botol", "kaleng", "ikat", "butir", "sachet", "loyang"];
const LOKASI = ["Kulkas", "Freezer", "Rak", "Lemari"];

const FIELD = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base sm:text-sm text-black focus:outline-none focus:border-black transition-colors bg-white";
const LABEL = "block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5";

const EMPTY = { nama: "", kategori: "", satuan: "", jumlah: "", lokasi: "", tanggal_kadaluarsa: "" };

export default function AddItemModal({ isOpen, onClose, onSubmit, suggestions = [] }) {
  const [formData, setFormData] = useState(EMPTY);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const nameRef = useRef(null);
  const suggestionsRef = useRef(null);

  const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(EMPTY);
  };

  const handleClose = () => {
    setFormData(EMPTY);
    setShowSuggestions(false);
    onClose();
  };

  const filtered = suggestions.filter(
    (item) =>
      formData.nama.length > 0 &&
      item.nama?.toLowerCase().includes(formData.nama.toLowerCase()) &&
      item.nama?.toLowerCase() !== formData.nama.toLowerCase()
  ).slice(0, 6);

  const selectSuggestion = (item) => {
    setFormData((prev) => ({
      ...prev,
      nama: item.nama,
      kategori: item.kategori || prev.kategori,
      satuan: item.satuan || prev.satuan,
      lokasi: item.lokasi || prev.lokasi,
      jumlah: "",
    }));
    setShowSuggestions(false);
    // Focus jumlah field after selecting
    setTimeout(() => {
      document.getElementById("add-jumlah")?.focus();
    }, 50);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        nameRef.current && !nameRef.current.contains(e.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>Tambah Item</ModalHeader>
        <ModalBody>
          {/* Name field with autocomplete */}
          <div className="relative">
            <label className={LABEL}>Nama Item</label>
            <input
              ref={nameRef}
              type="text"
              placeholder="Ketik nama barang..."
              value={formData.nama}
              onChange={(e) => {
                set("nama")(e);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              required
              autoFocus
              className={FIELD}
            />
            {showSuggestions && filtered.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              >
                {filtered.map((item) => (
                  <li key={item._id}>
                    <button
                      type="button"
                      onMouseDown={() => selectSuggestion(item)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-sm text-black">{item.nama}</span>
                      <span className="text-xs text-gray-400 ml-2 shrink-0">
                        {item.kategori} · {item.satuan}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className={LABEL}>Kategori</label>
            <select value={formData.kategori} onChange={set("kategori")} required className={FIELD}>
              <option value="" disabled>Pilih kategori...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Jumlah</label>
              <input
                id="add-jumlah"
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
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Lokasi <span className="normal-case text-gray-400 font-normal">(opsional)</span></label>
              <select value={formData.lokasi} onChange={set("lokasi")} className={FIELD}>
                <option value="">-</option>
                {LOKASI.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Kadaluarsa <span className="normal-case text-gray-400 font-normal">(opsional)</span></label>
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
          <button type="button" onClick={handleClose} className="px-4 py-2.5 text-sm text-gray-600 hover:text-black transition-colors">
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
