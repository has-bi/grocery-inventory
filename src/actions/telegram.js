export const sendTelegramMessage = async (message) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log("Debug: Checking Telegram Credentials...");
  console.log("Debug: Token exists?", !!token, token ? `(Starts with ${token.substring(0, 5)}...)` : "");
  console.log("Debug: ChatID exists?", !!chatId);

  if (!token || !chatId) {
    console.error("Telegram credentials missing in process.env");
    return { success: false, error: "Missing credentials. Did you restart the server?" };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();
    console.log("Debug: Telegram Response:", data);

    if (!data.ok) {
      return { success: false, error: data.description || "Unknown Telegram API error" };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return { success: false, error: error.message };
  }
};
