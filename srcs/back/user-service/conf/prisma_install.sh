#!/bin/sh

pnpx prisma generate
if [ "$NODE_ENV" = "dev" ]; then
    pnpx prisma migrate dev --name init
else
    pnpx prisma migrate deploy
fi