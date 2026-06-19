import { useState } from "react";
import { FiEdit2, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { formatDate } from "@/actions/dateFormatter";

const LOKASI_COLORS = {
  Kulkas: "bg-blue-100 text-blue-700",
  Freezer: "bg-cyan-100 text-cyan-700",
  Rak: "bg-amber-100 text-amber-700",
  Lemari: "bg-purple-100 text-purple-700",
};

function LokasiTag({ lokasi }) {
  if (!lokasi) return null;
  const cls = LOKASI_COLORS[lokasi] || "bg-gray-100 text-gray-600";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {lokasi}
    </span>
  );
}

function getExpiryStatus(date) {
  if (!date) return null;
  const expiry = new Date(date);
  const today = new Date();
  const threeDays = new Date();
  const fiveDays = new Date();
  threeDays.setDate(today.getDate() + 3);
  fiveDays.setDate(today.getDate() + 5);
  if (expiry < today) return "expired";
  if (expiry <= threeDays) return "urgent";
  if (expiry <= fiveDays) return "soon";
  return null;
}

function ExpiryBadge({ date }) {
  if (!date) return <span className="text-gray-400 text-sm">-</span>;

  const status = getExpiryStatus(date);
  const cls =
    status === "expired" ? "bg-red-100 text-red-700"
    : status === "urgent" || status === "soon" ? "bg-orange-100 text-orange-700"
    : "bg-gray-100 text-gray-700";

  return (
    <span className={`text-xs sm:text-sm px-2 py-1 rounded whitespace-nowrap ${cls}`}>
      {formatDate(date)}
    </span>
  );
}

function QuantityControl({ item, onQuickUpdate }) {
  const qty = parseFloat(item.jumlah) || 0;
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onQuickUpdate(item._id, qty - 1)}
        disabled={qty <= 0}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Kurangi jumlah"
      >
        <FiMinus size={12} />
      </button>
      <span className="text-sm text-black min-w-[4rem] text-center">
        {qty % 1 === 0 ? qty : qty} {item.satuan}
      </span>
      <button
        onClick={() => onQuickUpdate(item._id, qty + 1)}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black transition-colors"
        aria-label="Tambah jumlah"
      >
        <FiPlus size={12} />
      </button>
    </div>
  );
}

function DeleteConfirm({ item, onDelete, onCancel }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-500 whitespace-nowrap">Hapus?</span>
      <button
        onClick={onCancel}
        className="px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded hover:border-gray-400 transition-colors"
      >
        Batal
      </button>
      <button
        onClick={() => onDelete(item._id)}
        className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
      >
        Hapus
      </button>
    </div>
  );
}

export default function InventoryTable({ items, sortConfig, requestSort, onDelete, onEdit, onQuickUpdate }) {
  const [confirmId, setConfirmId] = useState(null);

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 text-sm">
        Tidak ada barang.
      </div>
    );
  }

  const handleDelete = async (id) => {
    setConfirmId(null);
    await onDelete(id);
  };

  return (
    <>
      {/* Mobile: card list */}
      <ul className="sm:hidden divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item._id} className="px-4 py-3 space-y-2.5">
            {/* Row 1: name + actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                <p className="text-sm text-black font-medium leading-snug truncate">
                  {item.nama}
                </p>
                {getExpiryStatus(item.tanggal_kadaluarsa) === "urgent" && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded shrink-0">Segera Pakai</span>
                )}
              </div>
              {confirmId === item._id ? (
                <DeleteConfirm
                  item={item}
                  onDelete={handleDelete}
                  onCancel={() => setConfirmId(null)}
                />
              ) : (
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
                    onClick={() => onEdit(item)}
                    aria-label={`Edit ${item.nama}`}
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                    onClick={() => setConfirmId(item._id)}
                    aria-label={`Hapus ${item.nama}`}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Row 2: badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-500">{item.kategori}</span>
              {item.lokasi && <span className="text-gray-300">·</span>}
              <LokasiTag lokasi={item.lokasi} />
              {item.tanggal_kadaluarsa && <ExpiryBadge date={item.tanggal_kadaluarsa} />}
            </div>

            {/* Row 3: quantity control */}
            <QuantityControl item={item} onQuickUpdate={onQuickUpdate} />
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th
                onClick={() => requestSort("nama")}
                className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Barang
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokasi
              </th>
              <th
                onClick={() => requestSort("tanggal_kadaluarsa")}
                className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kadaluarsa
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-black">{item.nama}</p>
                    {getExpiryStatus(item.tanggal_kadaluarsa) === "urgent" && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded shrink-0">Segera Pakai</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">{item.kategori}</p>
                </td>
                <td className="py-3.5 px-4">
                  <QuantityControl item={item} onQuickUpdate={onQuickUpdate} />
                </td>
                <td className="py-3.5 px-4">
                  <LokasiTag lokasi={item.lokasi} />
                </td>
                <td className="py-3.5 px-4">
                  <ExpiryBadge date={item.tanggal_kadaluarsa} />
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex justify-end items-center gap-1">
                    {confirmId === item._id ? (
                      <DeleteConfirm
                        item={item}
                        onDelete={handleDelete}
                        onCancel={() => setConfirmId(null)}
                      />
                    ) : (
                      <>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
                          onClick={() => onEdit(item)}
                          aria-label={`Edit ${item.nama}`}
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                          onClick={() => setConfirmId(item._id)}
                          aria-label={`Hapus ${item.nama}`}
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
