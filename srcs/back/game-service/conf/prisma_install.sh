#!/bin/sh

pnpx prisma generate
pnpx prisma migrate dev --name init