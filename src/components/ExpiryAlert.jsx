"use client";
import { formatDate } from "@/actions/dateFormatter";
import { useState, useEffect } from "react";

export default function ExpiryAlert({ items }) {
  const [nearExpiryItems, setNearExpiryItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);

  useEffect(() => {
    const checkExpiryDates = () => {
      let currentDate = new Date();
      const threeDaysFromNow = new Date(currentDate.getTime());
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const expiringSoon = [];
      const expired = [];

      items.forEach((item) => {
        if (!item.tanggal_kadaluarsa) return;

        const expiryDate = new Date(item.tanggal_kadaluarsa);

        if (expiryDate < currentDate) {
          expired.push(item);
        } else if (expiryDate <= threeDaysFromNow) {
          expiringSoon.push(item);
        }
      });

      setNearExpiryItems(expiringSoon);
      setExpiredItems(expired);
    };

    checkExpiryDates();
  }, [items]);

  if (nearExpiryItems.length === 0 && expiredItems.length === 0) return null;

  return (
    <div className="mb-6 pt-6 space-y-4">
      {/* Expired Items Alert */}
      {expiredItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Barang Kadaluarsa
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Barang yang sudah kadaluarsa:</p>
                <ul className="mt-1 list-disc list-inside">
                  {expiredItems.map((item) => (
                    <li key={item._id}>
                      {item.nama} : {formatDate(item.tanggal_kadaluarsa)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Near Expiry Items Alert */}
      {nearExpiryItems.length > 0 && (
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
      )}
    </div>
  );
}
