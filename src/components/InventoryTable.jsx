import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatDate } from "@/actions/dateFormatter";

function ExpiryBadge({ date }) {
  if (!date) return <span className="text-gray-400 text-sm">-</span>;

  const expiry = new Date(date);
  const today = new Date();
  const fiveDays = new Date();
  fiveDays.setDate(today.getDate() + 5);

  const isExpired = expiry < today;
  const isSoon = !isExpired && expiry <= fiveDays;

  const cls = isExpired
    ? "bg-red-100 text-red-700"
    : isSoon
    ? "bg-orange-100 text-orange-700"
    : "bg-gray-100 text-gray-700";

  return (
    <span className={`text-xs sm:text-sm px-2 py-1 rounded whitespace-nowrap ${cls}`}>
      {formatDate(date)}
    </span>
  );
}

function ActionButtons({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      <button
        className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
        onClick={() => onEdit(item)}
        title="Edit"
        aria-label={`Edit ${item.nama}`}
      >
        <FiEdit2 size={16} />
      </button>
      <button
        className="p-2.5 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
        onClick={() => onDelete(item._id)}
        title="Hapus"
        aria-label={`Hapus ${item.nama}`}
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  );
}

export default function InventoryTable({
  items,
  sortConfig,
  requestSort,
  onDelete,
  onEdit,
}) {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 text-sm">
        Tidak ada barang.
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <ul className="sm:hidden divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item._id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-black truncate">{item.nama}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">
                {item.kategori} · {item.jumlah} {item.satuan}
              </p>
              <div className="mt-1.5">
                <ExpiryBadge date={item.tanggal_kadaluarsa} />
              </div>
            </div>
            <ActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
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
              <th
                onClick={() => requestSort("jumlah")}
                className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah
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
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-black">{item.nama}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.kategori}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-black">
                    {item.jumlah} {item.satuan}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <ExpiryBadge date={item.tanggal_kadaluarsa} />
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end">
                    <ActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
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
