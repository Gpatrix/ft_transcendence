#!/bin/sh

# if [ "$NODE_ENV" = "dev" ]; then
    pnpx prisma migrate dev --name init
# else
#     pnpx prisma migrate deploy
#     pnpx prisma generate
# fi