#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    npm run seed
    exec npm run dev
else
    exec npm run build start;
fi