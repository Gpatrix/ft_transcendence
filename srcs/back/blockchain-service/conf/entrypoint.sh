#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    pnpx hardhat node &
    sleep 5
    pnpx hardhat run srcs/scripts/deploy.ts --network localhost
    exec pnpm dev
else
    pnpm build
    exec pnpm start;
fi