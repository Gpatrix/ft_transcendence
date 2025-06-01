#!/bin/sh

rm -rf ./node_modules
if [ "$NODE_ENV" = "dev" ]; then
    pnpm install;
else
    pnpm install --omit=dev;
fi