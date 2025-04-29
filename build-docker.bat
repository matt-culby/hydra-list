@echo off
echo Building Next.js application locally...
call npm run build

echo Building Docker image...
docker-compose build

echo Build complete. Run 'docker-compose up' to start the application.