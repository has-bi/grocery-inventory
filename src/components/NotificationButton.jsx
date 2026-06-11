import { FiBell } from "react-icons/fi";
import { useState } from "react";

export default function NotificationButton() {
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
    <button
      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
      onClick={handleNotify}
      disabled={loading}
      title="Kirim notifikasi Telegram"
      aria-label="Kirim notifikasi Telegram"
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <FiBell size={18} />
      )}
    </button>
  );
}
