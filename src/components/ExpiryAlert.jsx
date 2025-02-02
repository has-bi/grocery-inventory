"use client";
import { formatDate } from "@/actions/dateFormatter";
import { useState, useEffect } from "react";

export default function ExpiryAlert({ items }) {
  const [nearExpiryItems, setNearExpiryItems] = useState([]);

  useEffect(() => {
    const checkExpiryDates = () => {
      const today = new Date();
      const threeDaysFromNow = new Date(today.setDate(today.getDate() + 3));

      const expiringSoon = items.filter((item) => {
        if (!item.tanggal_kadaluarsa) return false;
        const expiryDate = new Date(item.tanggal_kadaluarsa);
        return expiryDate <= threeDaysFromNow && expiryDate >= new Date();
      });

      setNearExpiryItems(expiringSoon);
    };

    checkExpiryDates();
  }, [items]);

  if (nearExpiryItems.length === 0) return null;

  return (
    <div className="mb-6 pt-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Peringatan Kadaluarsa
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Barang yang akan kadaluarsa dalam 3 hari:</p>
              <ul className="mt-1 list-disc list-inside">
                {nearExpiryItems.map((item) => (
                  <li key={item._id}>
                    {item.nama} : {formatDate(item.tanggal_kadaluarsa)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
