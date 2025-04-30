@echo off
echo Stopping Docker containers...
docker-compose -f docker-compose.yml down

echo Docker containers stopped.