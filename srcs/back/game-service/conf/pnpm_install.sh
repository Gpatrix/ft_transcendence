#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    pnpm install;
else
    pnpm install --prod;
fi