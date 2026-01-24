import { Button, Tooltip } from "@heroui/react";
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
