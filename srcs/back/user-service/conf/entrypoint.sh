#!/bin/sh

node_exporter &

if [ "$NODE_ENV" = "dev" ]; then
    exec pnpm dev
else
    pnpm build
    exec pnpm start;
fi