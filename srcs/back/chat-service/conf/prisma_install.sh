#!/bin/sh

npx prisma generate

if [ "$NODE_ENV" = "dev" ]; then
    npx prisma migrate dev --name init
else
    npx prisma migrate deploy
fi