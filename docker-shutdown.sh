#!/bin/sh
set -e

# Backup to Google Drive if credentials are available
if [ -f "/app/credentials.json" ] && [ -n "$GOOGLE_DRIVE_FILE_ID" ]; then
  echo "Backing up data to Google Drive..."
  cd /app/scripts
  node backup-to-drive.js
  echo "Backup complete."
else
  echo "Skipping backup: credentials or file ID not available."
fi

# Exit gracefully
echo "Shutting down..."
exit 0