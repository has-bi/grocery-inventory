# Automating Notifications

Since this is a web application, it doesn't "run" in the background by itself. To make it check your inventory every day automatically, you need to set up a "trigger".

## Option 1: Linux Cron Job (For Local/VPS)
If you keep your PC or server running, you can use `cron` to visit the notification page for you every morning.

1.  Open your terminal and type:
    ```bash
    crontab -e
    ```
2.  Add this line to run everyday at 08:00 AM:
    ```bash
    0 7 * * * curl -X POST http://localhost:3000/api/notify
    ```
    *(Change `http://localhost:3000` to your actual domain if deployed)*

## Option 2: Vercel Cron (If Deployed)
If you deploy this app to Vercel, you can use their simpler Cron syntax.

1.  Create a `vercel.json` file in your project root:
    ```json
    {
      "crons": [
        {
          "path": "/api/notify",
          "schedule": "0 7 * * *"
        }
      ]
    }
    ```
2.  Deploy to Vercel. It will automatically call that route every day at 7 AM!
