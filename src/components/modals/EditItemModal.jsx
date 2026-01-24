import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select, SelectItem } from "@/components/ui/Select";

export default function EditItemModal({ isOpen, onClose, onSubmit, item }) {
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    satuan: "",
    jumlah: "",
    tanggal_kadaluarsa: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        nama: item.nama || "",
        kategori: item.kategori || "",
        satuan: item.satuan || "",
        jumlah: item.jumlah || "",
        tanggal_kadaluarsa: item.tanggal_kadaluarsa || "",
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categories = [
    { key: "Buah", label: "Buah" },
    { key: "Sayuran", label: "Sayuran" },
    { key: "Daging", label: "Daging" },
    { key: "Susu", label: "Susu" },
    { key: "Bahan Makanan", label: "Bahan Makanan" },
  ];

  const units = [
    { key: "kilogram", label: "Kilogram" },
    { key: "gram", label: "Gram" },
    { key: "liter", label: "Liter" },
    { key: "mililiter", label: "Mililiter" },
    { key: "pcs", label: "Pcs" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>Edit Item</ModalHeader>
        <ModalBody>
          <Input
            label="Nama Item"
            placeholder="Contoh: Apel Malang"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            required
          />
          <Select
            label="Kategori"
            placeholder="Pilih kategori"
            selectedKeys={formData.kategori ? [formData.kategori] : []}
            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
            required
          >
            {categories.map((cat) => (
              <SelectItem key={cat.key} value={cat.key}>
                {cat.label}
              </SelectItem>
            ))}
          </Select>
          <div className="flex gap-4">
            <Input
              type="number"
              label="Jumlah"
              placeholder="0"
              min="0"
              value={formData.jumlah}
              onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
              required
              className="flex-1"
              labelPlacement="outside"
            />
            <Select
              label="Satuan"
              placeholder="Satuan"
              selectedKeys={formData.satuan ? [formData.satuan] : []}
              onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
              required
              className="flex-1"
            >
              {units.map((unit) => (
                <SelectItem key={unit.key} value={unit.key}>
                  {unit.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Input
            type="date"
            label="Tanggal Kadaluarsa"
            placeholder="Pilih tanggal"
            value={formData.tanggal_kadaluarsa}
            onChange={(e) =>
              setFormData({ ...formData, tanggal_kadaluarsa: e.target.value })
            }
            labelPlacement="outside"
          />
        </ModalBody>
        <ModalFooter>
          <button type="button" className="px-4 py-2 text-gray-600 hover:text-black transition-colors" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Simpan Perubahan
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
