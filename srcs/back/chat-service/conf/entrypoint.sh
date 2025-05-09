#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    exec npm run dev
else
    exec npm run build start;
fi