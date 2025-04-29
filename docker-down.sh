#!/bin/bash
set -e

echo "Stopping Docker containers..."
docker-compose down

echo "Docker containers stopped."