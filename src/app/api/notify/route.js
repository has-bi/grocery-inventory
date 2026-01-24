import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/actions/telegram";
import { formatDate } from "@/actions/dateFormatter";

const DATA_URL = "https://v1.appbackend.io/v1/rows/6lqd5EErN0qA";

export async function POST() {
  try {
    // 1. Fetch current inventory
    const res = await fetch(DATA_URL, { cache: "no-store" });
    const json = await res.json();
    const items = json.data;

    // 2. Filter expiring items (<= 3 days)
    const today = new Date();
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(today.getDate() + 5);

    const expiringItems = items.filter((item) => {
      if (!item.tanggal_kadaluarsa) return false;
      const expiryDate = new Date(item.tanggal_kadaluarsa);
      return expiryDate <= fiveDaysFromNow && expiryDate >= today;
    });
    
    const expiredItems = items.filter((item) => {
        if (!item.tanggal_kadaluarsa) return false;
        const expiryDate = new Date(item.tanggal_kadaluarsa);
        return expiryDate < today;
    });

    if (expiringItems.length === 0 && expiredItems.length === 0) {
      return NextResponse.json({ message: "No expiring items found." });
    }

    // 3. Construct Message
    let message = "🛒 *Laporan Inventori Dapur*\n\n";

    if (expiredItems.length > 0) {
        message += "🚨 *SUDAH KADALUARSA:*\n";
        expiredItems.forEach(item => {
            message += `- ${item.nama} (${formatDate(item.tanggal_kadaluarsa)})\n`;
        });
        message += "\n";
    }

    if (expiringItems.length > 0) {
        message += "⚠️ *SEGERA BASI (<= 5 Hari):*\n";
        expiringItems.forEach(item => {
             message += `- ${item.nama} (${formatDate(item.tanggal_kadaluarsa)})\n`;
        });
    }

    // 4. Send to Telegram
    const result = await sendTelegramMessage(message);

    if (result.success) {
      return NextResponse.json({ success: true, message: "Notification sent!" });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
