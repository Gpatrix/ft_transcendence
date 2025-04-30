#!/bin/sh

cd ./asset

if [ "$NODE_ENV" = "dev" ]; then
    npm install && npm cache clean --force;
else
    npm install --omit=dev && npm cache clean --force;
fi