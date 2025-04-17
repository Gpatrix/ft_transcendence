#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; \
then npm install; \
else npm install --omit=dev && npm run build; \
fi

if [ "$NODE_ENV" = "dev" ]; then
    npm install;
    npm run db:dev; 
    exec npm run dev
else
    npm install --omit=dev;
    npm run build
    npm run db:deploy
    exec npm run start;
fi
