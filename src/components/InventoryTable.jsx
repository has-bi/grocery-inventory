import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  User,
  Chip,
} from "@heroui/react";
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
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-gray-900">{item.nama}</p>
            <p className="text-bold text-tiny text-gray-700 capitalize">
              {item.kategori}
            </p>
          </div>
        );
      case "jumlah":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm text-gray-900">
              {item.jumlah} {item.satuan}
            </p>
          </div>
        );
      case "tanggal_kadaluarsa":
        if (!item.tanggal_kadaluarsa) return <span className="text-gray-700">-</span>;
        
        const isExpired = new Date(item.tanggal_kadaluarsa) < new Date();
        return (
          <Chip
            color={isExpired ? "danger" : "default"}
            size="sm"
            variant="flat"
          >
            {formatDate(item.tanggal_kadaluarsa)}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit Item">
              <span
                className="text-lg text-gray-700 cursor-pointer active:opacity-50 hover:text-gray-900"
                onClick={() => onEdit(item)}
              >
                <FiEdit2 />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete Item">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => onDelete(item._id)}
              >
                <FiTrash2 />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <div className="w-full">
      <Table aria-label="Inventory Table" removeWrapper isStriped>
        <TableHeader>
          <TableColumn key="nama" allowsSorting onClick={() => requestSort("nama")}>
            Nama Barang
          </TableColumn>
          <TableColumn
            key="jumlah"
            allowsSorting
            onClick={() => requestSort("jumlah")}
          >
            Jumlah & Satuan
          </TableColumn>
          <TableColumn
            key="tanggal_kadaluarsa"
            allowsSorting
            onClick={() => requestSort("tanggal_kadaluarsa")}
          >
            Tanggal Kadaluarsa
          </TableColumn>
          <TableColumn key="actions" align="end">
            Aksi
          </TableColumn>
        </TableHeader>
        <TableBody items={items} emptyContent={"Tidak ada barang."}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
