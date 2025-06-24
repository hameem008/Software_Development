#!/bin/bash

# Free ports 3000, 8080, 5432 if any process is using them
echo "🔓 Freeing ports 3000, 8080, 5432 if occupied..."
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 8080/tcp 2>/dev/null || true
fuser -k 5432/tcp 2>/dev/null || true

# Pull latest Docker images from Docker Hub
docker pull hameem08/mediline-db:latest
docker pull hameem08/mediline-backend:latest
docker pull hameem08/mediline-frontend:latest

# Stop and remove existing containers if running
docker rm -f my_postgres_db mediline-backend mediline-frontend 2>/dev/null || true

# Start containers in detached mode using docker-compose.deploy.yml
docker-compose -f docker-compose.deploy.yml up -d
