#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    npm install;
else
    npm install --prod;
    rm -f hardhat.config.ts;
    rm -rf srcs/test
fi