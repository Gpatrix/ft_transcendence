#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    pnpm install;
else
    pnpm install --omit=dev;
    rm -f hardhat.config.ts;
    rm -rf srcs/test
fi