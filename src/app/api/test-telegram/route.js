import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/actions/telegram";

export async function POST() {
  try {
    const message = "🧪 *Test Notification*\n\nThis is a test message from your BarangXLupa app!\n\n✅ Telegram integration is working correctly.";

    const result = await sendTelegramMessage(message);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test notification sent to Telegram!",
        telegramResponse: result.data
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test notification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
