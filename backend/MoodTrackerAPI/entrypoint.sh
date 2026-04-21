#!/bin/bash
set -e

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to be ready..."
sleep 15

# Run database migrations
echo "Running database migrations..."
dotnet ef database update --no-build || echo "Migrations failed or already applied"

# Start the application
echo "Starting application..."
exec dotnet MoodTrackerAPI.dll
