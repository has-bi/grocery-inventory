#!/bin/bash

# Test script for daily notification cron job
# This simulates what Vercel Cron will do in production

echo "Testing daily notification endpoint..."
echo ""

# Get the port from the running dev server
PORT=$(lsof -ti:3000,3001,3002,3003 | head -1 | xargs -I {} lsof -Pan -p {} -i | grep LISTEN | awk '{print $9}' | cut -d: -f2 | head -1)

if [ -z "$PORT" ]; then
  PORT=3000
fi

echo "Using port: $PORT"
echo ""

# Call the cron endpoint
curl -X GET "http://localhost:$PORT/api/cron/daily-notification" \
  -H "Authorization: Bearer your-secret-key-change-this-in-production" \
  -w "\n\nStatus Code: %{http_code}\n" \
  -s

echo ""
echo "Check your Telegram for the notification!"
