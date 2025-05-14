#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    pnpm install && pnpm cache clean;
else
    pnpm install --omit=dev && pnpm cache clean;
fi