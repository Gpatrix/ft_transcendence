#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    exec pnpm dev
else
    pnpm build;
    exec pnpm build start;
fi