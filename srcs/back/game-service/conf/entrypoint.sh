#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    pnpm seed
    exec pnpm dev
else
    pnpm build;
    exec pnpm start;
fi