@echo off
echo Starting Docker containers...
docker-compose -f docker-compose.yml up -d

echo Docker containers started. Access the application at http://localhost:3000