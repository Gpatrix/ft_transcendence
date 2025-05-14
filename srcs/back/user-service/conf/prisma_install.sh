#!/bin/sh

npx prisma generate
npx prisma migrate dev --name init

#  "db:deploy": "npx prisma generate && npx prisma migrate deploy && npx prisma db seed",
#  "db:dev": "npx prisma generate && npx prisma db push && npx prisma db seed"