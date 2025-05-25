#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    npx hardhat node &
    sleep 5
    npx hardhat run srcs/scripts/deploy.ts --network localhost
    exec pnpm dev
else
    pnpm build
    exec pnpm start;
fi