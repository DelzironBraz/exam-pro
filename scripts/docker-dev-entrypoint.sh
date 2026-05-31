#!/bin/sh
set -e

if [ ! -d node_modules/@prisma/adapter-pg ]; then
  npm ci
fi

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding admin user..."
npx ts-node prisma/seed.ts || true

exec npm run start:dev
