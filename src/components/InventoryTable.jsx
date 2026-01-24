import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatDate } from "@/actions/dateFormatter";

export default function InventoryTable({
  items,
  sortConfig,
  requestSort,
  onDelete,
  onEdit,
}) {
  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "nama":
        return (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-black">{item.nama}</p>
            <p className="text-xs text-gray-400 capitalize">
              {item.kategori}
            </p>
          </div>
        );
      case "jumlah":
        return (
          <p className="text-sm text-black">
            {item.jumlah} {item.satuan}
          </p>
        );
      case "tanggal_kadaluarsa":
        if (!item.tanggal_kadaluarsa) return <span className="text-gray-400 text-sm">-</span>;

        const isExpired = new Date(item.tanggal_kadaluarsa) < new Date();
        return (
          <span className={`text-sm px-2 py-1 rounded ${isExpired ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
            {formatDate(item.tanggal_kadaluarsa)}
          </span>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-black"
              onClick={() => onEdit(item)}
              title="Edit"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-600 hover:text-red-600"
              onClick={() => onDelete(item._id)}
              title="Delete"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <div className="w-full overflow-x-auto">
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
          {items.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-400 py-12 text-sm">
                Tidak ada barang.
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr
                key={item._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">{renderCell(item, "nama")}</td>
                <td className="py-4 px-4">{renderCell(item, "jumlah")}</td>
                <td className="py-4 px-4">{renderCell(item, "tanggal_kadaluarsa")}</td>
                <td className="py-4 px-4">{renderCell(item, "actions")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
