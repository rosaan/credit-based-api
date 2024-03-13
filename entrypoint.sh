#!/bin/sh

set -e
set -o xtrace

echo "Starting entrypoint script for Docker ExpressJS project..."

# Migrate the database.
echo "Migrating the database..."
npm run migrate:prod

# Seed the database.
echo "Seeding the database..."
npm run seed:prod

# Start the server.
echo "Starting the server..."
npm run start

echo "Entrypoint script completed."