#!/bin/sh

cd ./asset

if [ "$NODE_ENV" = "dev" ]; then
    npx prisma migrate dev --name init
else
    npx prisma migrate deploy
fi

npm run build;

if [ "$NODE_ENV" = "dev" ]; then
    exec npm run dev
else
    exec npm run start;
fi