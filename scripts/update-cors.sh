#!/bin/bash
# Bash script to update CORS settings with Render frontend URL
# Usage: ./scripts/update-cors.sh "https://moodtracker-frontend.onrender.com"

if [ -z "$1" ]; then
    echo "❌ Error: Frontend URL is required"
    echo "Usage: $0 <frontend-url>"
    echo "Example: $0 https://moodtracker-frontend.onrender.com"
    exit 1
fi

FRONTEND_URL="$1"
PROGRAM_PATH="./backend/MoodTrackerAPI/Program.cs"

echo "🔧 Updating CORS settings in Program.cs..."

if [ ! -f "$PROGRAM_PATH" ]; then
    echo "❌ Error: Program.cs not found at $PROGRAM_PATH"
    exit 1
fi

# Check if URL already exists
if grep -q "$FRONTEND_URL" "$PROGRAM_PATH"; then
    echo "✅ Frontend URL already in CORS policy!"
    exit 0
fi

# Add the new URL to CORS policy
# This uses sed to find the WithOrigins section and add the new URL
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|\"http://localhost:5173\"|\"http://localhost:5173\",\n            \"$FRONTEND_URL\"|" "$PROGRAM_PATH"
else
    # Linux
    sed -i "s|\"http://localhost:5173\"|\"http://localhost:5173\",\n            \"$FRONTEND_URL\"|" "$PROGRAM_PATH"
fi

if [ $? -eq 0 ]; then
    echo "✅ CORS policy updated successfully!"
    echo "Frontend URL added: $FRONTEND_URL"
    echo ""
    echo "Next steps:"
    echo "1. Review changes: git diff $PROGRAM_PATH"
    echo "2. Commit: git add $PROGRAM_PATH && git commit -m 'feat: add Render frontend to CORS'"
    echo "3. Push: git push"
else
    echo "❌ Error: Failed to update CORS policy"
    echo "Please manually add '$FRONTEND_URL' to the CORS policy"
    exit 1
fi
