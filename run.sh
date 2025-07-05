#!/bin/bash

set -e
cd "$(dirname "$0")" || exit 1

if [[ "$1" == "-db" ]]; then
  echo "🔁 Rebuilding only the database..."

  docker rm -f my_postgres_db 2>/dev/null || true
  docker compose down -v db
  docker compose build db
  docker compose up -d db

elif [[ "$1" == "-backend" ]]; then
  echo "🔁 Rebuilding only the backend..."

  docker rm -f mediline-backend 2>/dev/null || true
  docker compose build backend
  docker compose up -d backend

elif [[ "$1" == "-frontend" ]]; then
  echo "🔁 Rebuilding only the frontend..."

  docker rm -f mediline-frontend 2>/dev/null || true
  docker compose build frontend
  docker compose up -d frontend

else
  echo "🔍 Freeing up ports 3000, 8080, 5432..."
  fuser -k 3000/tcp 2>/dev/null || true
  fuser -k 8080/tcp 2>/dev/null || true
  fuser -k 5432/tcp 2>/dev/null || true

  echo "🧹 Removing old containers..."
  docker rm -f my_postgres_db mediline-backend mediline-frontend 2>/dev/null || true

  docker compose down -v
  docker-compose build --no-cache
  docker compose up -d

  echo "🚀 Running services................."
  docker ps
fi
