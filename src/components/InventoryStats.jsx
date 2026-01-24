import { Card, CardBody } from "@heroui/react";
import { FiPackage, FiAlertCircle, FiClock } from "react-icons/fi";

export default function InventoryStats({ items }) {
  const stats = items.reduce(
    (acc, item) => {
      acc.totalItems += 1;

      if (item.tanggal_kadaluarsa) {
        const expiryDate = new Date(item.tanggal_kadaluarsa);
        const today = new Date();
        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(today.getDate() + 5);

        if (expiryDate < today) {
          acc.expired += 1;
        } else if (expiryDate <= fiveDaysFromNow) {
          acc.expiringSoon += 1;
        }
      }

      return acc;
    },
    { totalItems: 0, expired: 0, expiringSoon: 0 }
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Barang"
        value={stats.totalItems}
        icon={<FiPackage className="text-blue-500" size={24} />}
        color="primary"
      />
      <StatCard
        title="Akan Basi (<= 5 Hari)"
        value={stats.expiringSoon}
        icon={<FiAlertCircle className="text-orange-500" size={24} />}
        color="warning"
        alert={stats.expiringSoon > 0}
      />
      <StatCard
        title="Sudah Kadaluarsa"
        value={stats.expired}
        icon={<FiClock className="text-red-500" size={24} />}
        color="danger"
        alert={stats.expired > 0}
      />
    </div>
  );
}

function StatCard({ title, value, icon, subtext, alert }) {
  return (
    <Card className={`border-none ${alert ? "ring-2 ring-red-500/20" : ""}`}>
      <CardBody className="flex flex-row items-center justify-between p-4">
        <div>
          <p className="text-sm text-gray-700 font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
            {subtext && <span className="text-xs text-red-600 font-medium">{subtext}</span>}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
      </CardBody>
    </Card>
  );
}
