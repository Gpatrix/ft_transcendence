#!/bin/sh

cd ./asset

if [ "$NODE_ENV" = "dev" ]; then
    npm install;
    npx prisma generate && npx prisma migrate dev --skip-seed --name init
else
    npm install --omit=dev;
    npx prisma generate && npx prisma migrate --skip-seed deploy
fi