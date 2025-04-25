#!/bin/sh

cd ./asset

if [ "$NODE_ENV" = "dev" ]; then
    npm install;
else
    npm install --omit=dev;
fi