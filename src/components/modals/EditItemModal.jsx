import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

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
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1 text-gray-900">
              Edit Item
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nama Item"
                placeholder="Contoh: Apel Malang"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
                classNames={{
                  input: "text-gray-900",
                  label: "text-gray-900",
                }}
              />
              <Select
                label="Kategori"
                placeholder="Pilih kategori"
                selectedKeys={formData.kategori ? [formData.kategori] : []}
                onChange={(e) =>
                  setFormData({ ...formData, kategori: e.target.value })
                }
                required
                classNames={{
                  value: "text-gray-900",
                  label: "text-gray-900",
                  trigger: "text-gray-900",
                }}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key} className="text-gray-900">
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
                  onChange={(e) =>
                    setFormData({ ...formData, jumlah: e.target.value })
                  }
                  required
                  className="flex-1"
                  classNames={{
                    input: "text-gray-900",
                    label: "text-gray-900",
                  }}
                />
                <Select
                  label="Satuan"
                  placeholder="Satuan"
                  selectedKeys={formData.satuan ? [formData.satuan] : []}
                  onChange={(e) =>
                    setFormData({ ...formData, satuan: e.target.value })
                  }
                  required
                  className="flex-1"
                  classNames={{
                    value: "text-gray-900",
                    label: "text-gray-900",
                    trigger: "text-gray-900",
                  }}
                >
                  {units.map((unit) => (
                    <SelectItem key={unit.key} value={unit.key} className="text-gray-900">
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
                  setFormData({
                    ...formData,
                    tanggal_kadaluarsa: e.target.value,
                  })
                }
                labelPlacement="outside"
                classNames={{
                  input: "text-gray-900",
                  label: "text-gray-900",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button color="primary" type="submit">
                Simpan Perubahan
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
