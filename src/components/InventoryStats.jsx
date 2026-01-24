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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Total Barang"
        value={stats.totalItems}
        icon={<FiPackage size={20} />}
        iconColor="text-gray-600"
      />
      <StatCard
        title="Akan Basi"
        value={stats.expiringSoon}
        icon={<FiAlertCircle size={20} />}
        iconColor="text-orange-500"
        alert={stats.expiringSoon > 0}
      />
      <StatCard
        title="Kadaluarsa"
        value={stats.expired}
        icon={<FiClock size={20} />}
        iconColor="text-red-500"
        alert={stats.expired > 0}
      />
    </div>
  );
}

function StatCard({ title, value, icon, iconColor, alert }) {
  return (
    <div className={`p-4 rounded-lg border ${alert ? "border-red-200 bg-red-50/50" : "border-gray-200 bg-white"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`${iconColor}`}>{icon}</span>
        <span className="text-3xl font-light text-black">{value}</span>
      </div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  );
}
