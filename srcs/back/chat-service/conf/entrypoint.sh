#!/bin/sh

cd ./asset


if [ ! -d ./prisma/db]; then
    if [ "$NODE_ENV" = "dev" ]; then
        npx prisma generate && npx prisma migrate dev --name init
    else
        npx prisma generate && npx prisma migrate deploy
    fi
fi

npm run build;

exec sleep infinity

if [ "$NODE_ENV" = "dev" ]; then
    exec npm run dev
else
    exec npm run start;
fi
