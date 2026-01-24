# Telegram Notification Setup

To enable Telegram notifications for expiring items, follow these steps:

1.  **Create a Bot**:
    - Open Telegram and search for **@BotFather**.
    - Send `/newbot` and follow the instructions.
    - Copy the **HTTP API Token**.

2.  **Get Your Chat ID**:
    - Open Telegram and search for **@userinfobot**.
    - Start the bot to see your **Id**.
    - **IMPORTANT**: Go to your new bot (search for its username) and click **Start** or send a message like "Hello". The bot *cannot* message you until you message it first.

3.  **Configure Environment Variables**:
    - Create a file named `.env.local` in the root of your project.
    - Add the following lines:

    ```env
    TELEGRAM_BOT_TOKEN=your_token_from_botfather
    TELEGRAM_CHAT_ID=your_chat_id
    ```

4.  **Test**:
    - Restart your dev server (`npm run dev`).
    - Click the **Bell Icon** in the top right of the inventory stats to send a test notification.
