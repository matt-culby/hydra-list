@echo off
echo Building Next.js application locally...
cd ..
call npm run build

echo Building Docker image...
cd docker
docker-compose build

echo Build complete. Run 'docker-compose up' to start the application.