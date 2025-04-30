# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATA_DIR=/data

# Create data directory
RUN mkdir -p /data

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy data files to setup directory
RUN mkdir -p /setup-data
COPY src/data/* /setup-data/

# Expose port
EXPOSE 3000

# Initialize data directory if empty (replacing the shell script entrypoint)
RUN echo 'if not exist "C:\data\*" xcopy /E /I /Y C:\setup-data\* C:\data\' > /app/docker-entrypoint.cmd
ENTRYPOINT ["cmd", "/C", "docker-entrypoint.cmd && npm start"]

# Start the Next.js application
CMD ["npm", "start"]