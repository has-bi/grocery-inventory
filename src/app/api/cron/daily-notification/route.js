import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/actions/telegram";
import { formatDate } from "@/actions/dateFormatter";

const DATA_URL = "https://v1.appbackend.io/v1/rows/6lqd5EErN0qA";

export async function GET(request) {
  try {
    // Verify the request is from Vercel Cron or has the correct secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 1. Fetch current inventory
    const res = await fetch(DATA_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch inventory: ${res.status} ${res.statusText}`);
    }

    const text = await res.text();
    if (!text) {
      throw new Error("Empty response from inventory API");
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error. Response text:", text);
      throw new Error("Invalid JSON response from inventory API");
    }

    const items = json.data || [];

    // 2. Filter expiring items (<= 5 days) and expired items
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight

    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(today.getDate() + 5);
    fiveDaysFromNow.setHours(23, 59, 59, 999); // Set to end of day

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
      console.log("No expiring or expired items. Skipping notification.");
      return NextResponse.json({
        success: true,
        message: "No expiring or expired items found. No notification sent.",
      });
    }

    // 3. Construct Message
    let message = "🛒 *Laporan Harian Inventori Dapur*\n\n";
    message += `📅 ${new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}\n\n`;

    if (expiredItems.length > 0) {
      message += "🚨 *SUDAH KADALUARSA:*\n";
      expiredItems.forEach((item) => {
        message += `- ${item.nama} (${formatDate(item.tanggal_kadaluarsa)})\n`;
      });
      message += "\n";
    }

    if (expiringItems.length > 0) {
      message += "⚠️ *SEGERA BASI (<= 5 Hari):*\n";
      expiringItems.forEach((item) => {
        message += `- ${item.nama} (${formatDate(item.tanggal_kadaluarsa)})\n`;
      });
    }

    // 4. Send to Telegram
    const result = await sendTelegramMessage(message);

    if (result.success) {
      console.log("Daily notification sent successfully");
      return NextResponse.json({
        success: true,
        message: "Daily notification sent!",
        expiredCount: expiredItems.length,
        expiringCount: expiringItems.length,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cron notification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
