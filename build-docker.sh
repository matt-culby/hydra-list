#!/bin/bash
set -e

echo "Building Next.js application locally..."
npm run build

echo "Building Docker image..."
docker-compose build

echo "Build complete. Run 'docker-compose up' to start the application."