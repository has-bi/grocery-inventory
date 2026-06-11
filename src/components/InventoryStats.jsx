import { FiPackage, FiAlertCircle, FiClock, FiTrendingDown } from "react-icons/fi";

export default function InventoryStats({ items }) {
  const stats = items.reduce(
    (acc, item) => {
      acc.totalItems += 1;

      const qty = parseFloat(item.jumlah);
      if (!isNaN(qty) && qty <= 1) acc.lowStock += 1;

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
    { totalItems: 0, lowStock: 0, expired: 0, expiringSoon: 0 }
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      <StatCard
        title="Total Barang"
        value={stats.totalItems}
        icon={<FiPackage size={18} />}
        iconColor="text-gray-600"
      />
      <StatCard
        title="Stok Rendah"
        value={stats.lowStock}
        icon={<FiTrendingDown size={18} />}
        iconColor="text-yellow-600"
        alert={stats.lowStock > 0}
        alertColor="yellow"
      />
      <StatCard
        title="Akan Basi"
        value={stats.expiringSoon}
        icon={<FiAlertCircle size={18} />}
        iconColor="text-orange-500"
        alert={stats.expiringSoon > 0}
        alertColor="orange"
      />
      <StatCard
        title="Kadaluarsa"
        value={stats.expired}
        icon={<FiClock size={18} />}
        iconColor="text-red-500"
        alert={stats.expired > 0}
        alertColor="red"
      />
    </div>
  );
}

function StatCard({ title, value, icon, iconColor, alert, alertColor }) {
  const borderBg = alert
    ? alertColor === "yellow"
      ? "border-yellow-200 bg-yellow-50/50"
      : alertColor === "orange"
      ? "border-orange-200 bg-orange-50/50"
      : "border-red-200 bg-red-50/50"
    : "border-gray-200 bg-white";

  return (
    <div className={`p-3 sm:p-4 rounded-lg border ${borderBg}`}>
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span className={`${iconColor}`}>{icon}</span>
        <span className="text-2xl sm:text-3xl font-light text-black">{value}</span>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 font-medium">{title}</p>
    </div>
  );
}
