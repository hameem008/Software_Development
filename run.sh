#!/bin/bash

echo "🔍 Checking and freeing ports 5432, 3000 and 8080..."
fuser -k 3000/tcp 2>/dev/null
fuser -k 8080/tcp 2>/dev/null
fuser -k 5432/tcp 2>/dev/null

echo "🧹 Removing old containers (if any)..."
docker rm -f my_postgres_db 2>/dev/null
docker rm -f mediline-backend 2>/dev/null
docker rm -f mediline-frontend 2>/dev/null

cd "$(dirname "$0")" || exit 1

# Tear down containers but preserve DB volume
docker-compose down -v

# Rebuild and start all services
docker-compose up --build -d

# ./mvnw spring-boot:run
# PGPASSWORD=mypassword docker exec -it my_postgres_db psql -U myuser -d mydb