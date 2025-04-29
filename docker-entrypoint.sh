#!/bin/sh
set -e

# If data directory is empty, initialize with default data
if [ -z "$(ls -A /data)" ]; then
  echo "Initializing data directory with default data..."
  cp -r /setup-data/* /data/
  echo "Data directory initialized."
fi

# Execute the command provided as arguments (CMD from Dockerfile)
exec "$@"