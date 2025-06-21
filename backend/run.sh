#!/bin/bash

docker rm -f my_postgres_db
docker rm -f mediline-backend

cd "$(dirname "$0")" || exit 1

# Tear down existing containers and volumes
docker-compose down -v

# Rebuild and start everything
docker-compose up --build
