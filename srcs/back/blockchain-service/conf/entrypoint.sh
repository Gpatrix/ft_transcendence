#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    npx hardhat node &
    sleep 5
    npx hardhat run srcs/scripts/deploy.ts --network localhost
    exec npm run dev
else
    npm run build
    exec npm run start;
fi