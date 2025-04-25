#!/bin/sh

cd ./asset

npm run build;

if [ "$NODE_ENV" = "dev" ]; then
    exec npm run dev
else
    exec npm run start;
fi
