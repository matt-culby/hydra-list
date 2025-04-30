#!/bin/sh
# Initialize data directory if empty
if [ ! "$(ls -A /data)" ]; then
  echo "Initializing data directory with example data..."
  cp -r /setup-data/* /data/
fi

# Start the Next.js application
exec npm start