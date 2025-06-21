#!/bin/bash

# Kill any process using ports 3000 and 8080
echo "🔍 Checking and freeing ports 3000 and 8080..."
fuser -k 3000/tcp 2>/dev/null
fuser -k 8080/tcp 2>/dev/null

# Remove any old containers (if they still exist)
docker rm -f my_postgres_db 2>/dev/null
docker rm -f mediline-backend 2>/dev/null
docker rm -f mediline-frontend 2>/dev/null

cd "$(dirname "$0")" || exit 1

# Tear down existing containers and volumes
docker-compose down -v

# Rebuild and start all services
docker-compose up --build
