#!/bin/sh

cd ./asset

if [ "$NODE_ENV" = "dev" ]; then
    npm install;
    npm run build;
    exec npm run dev
else
    npm install --omit=dev;
    npm run build
    exec npm run start;
fi
