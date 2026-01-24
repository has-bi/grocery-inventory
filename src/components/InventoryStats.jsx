import { Card, CardBody } from "@heroui/react";
import { FiPackage, FiAlertCircle, FiClock, FiActivity } from "react-icons/fi";

export default function InventoryStats({ items }) {
  const stats = items.reduce(
    (acc, item) => {
      acc.totalItems += 1;
      acc.totalQuantity += parseInt(item.jumlah) || 0;

      if (parseInt(item.jumlah) < 5) {
        acc.lowStock += 1;
      }

      if (item.tanggal_kadaluarsa) {
        const expiryDate = new Date(item.tanggal_kadaluarsa);
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);

        if (expiryDate < today) {
          acc.expired += 1;
        } else if (expiryDate <= threeDaysFromNow) {
          acc.expiringSoon += 1;
        }
      }

      return acc;
    },
    { totalItems: 0, totalQuantity: 0, lowStock: 0, expired: 0, expiringSoon: 0 }
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative">
      <div className="absolute top-0 right-0 -mt-10">
        <NotificationButton />
      </div>
      <StatCard
        title="Total Barang"
        value={stats.totalItems}
        icon={<FiPackage className="text-blue-500" size={24} />}
        color="primary"
      />
      <StatCard
        title="Total Stok"
        value={stats.totalQuantity}
        icon={<FiActivity className="text-green-500" size={24} />}
        color="success"
      />
      <StatCard
        title="Stok Menipis"
        value={stats.lowStock}
        icon={<FiAlertCircle className="text-orange-500" size={24} />}
        color="warning"
        alert={stats.lowStock > 0}
      />
      <StatCard
        title="Perlu Perhatian"
        value={stats.expired + stats.expiringSoon}
        subtext={`${stats.expired} Kadaluarsa, ${stats.expiringSoon} Segera`}
        icon={<FiClock className="text-red-500" size={24} />}
        color="danger"
        alert={stats.expired > 0 || stats.expiringSoon > 0}
      />
    </div>
  );
}

import { Button, Tooltip } from "@heroui/react";
import { FiBell } from "react-icons/fi";
import { useState } from "react";

function NotificationButton() {
  const [loading, setLoading] = useState(false);

  const handleNotify = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notify", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Notifikasi terkirim ke Telegram!");
      } else {
        alert("Gagal mengirim notifikasi: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip content="Test Telegram Notification">
      <Button
        isIconOnly
        size="sm"
        color="primary"
        variant="ghost"
        onPress={handleNotify}
        isLoading={loading}
      >
        <FiBell size={20} />
      </Button>
    </Tooltip>
  );
}

function StatCard({ title, value, icon, subtext, alert }) {
  return (
    <Card className={`border-none ${alert ? "ring-2 ring-red-500/20" : ""}`}>
      <CardBody className="flex flex-row items-center justify-between p-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
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
