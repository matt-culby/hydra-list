@echo off
echo Building Next.js application locally...
cd ..
call npm run build

echo Building Docker image...
cd docker
docker-compose -f docker-compose.yml build

echo Build complete. Run 'docker-up.bat' to start the application.