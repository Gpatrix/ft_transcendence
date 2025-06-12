FROM node:23-alpine

WORKDIR  /usr/src/user-service

RUN apk update --no-cache && \
    apk add sqlite openssl pnpm pnpm prometheus-node-exporter --no-cache

ARG DATABASE_URL
ARG NODE_ENV
COPY ./asset/package.json .
COPY ./conf/pnpm_install.sh .
RUN chmod +x pnpm_install.sh && ./pnpm_install.sh

COPY ./asset/prisma ./prisma
COPY ./conf/prisma_install.sh .
COPY ./asset/tsconfig.json .
RUN chmod +x prisma_install.sh && ./prisma_install.sh

COPY ./conf/entrypoint.sh .
COPY ./asset/srcs ./srcs
RUN chmod +x entrypoint.sh 

ENTRYPOINT ["./entrypoint.sh"]