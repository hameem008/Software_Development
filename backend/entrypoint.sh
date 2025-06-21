#!/bin/bash

# Start the PostgreSQL server
docker-entrypoint.sh postgres &

# Wait for PostgreSQL to be ready
until pg_isready -h localhost -U myuser -d mydb; do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

# Function to export database data to 2-data.sql
export_data() {
  echo "Exporting database data to /docker-entrypoint-initdb.d/2-data.sql..."
  pg_dump -U myuser -d mydb --data-only --inserts > /docker-entrypoint-initdb.d/2-data.sql
  echo "Data exported successfully."
}

# Trap SIGTERM and SIGINT to export data on container exit
trap 'export_data; kill $!; wait $!; exit 0' SIGTERM SIGINT

# Keep the container running
wait