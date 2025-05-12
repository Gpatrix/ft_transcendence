FROM node:23-alpine

WORKDIR  /usr/src/user-service

RUN apk update --no-cache && \
    apk add sqlite openssl --no-cache

ARG DATABASE_URL
ARG NODE_ENV
COPY ./asset/package.json .
COPY ./conf/npm_install.sh .
RUN chmod +x npm_install.sh && ./npm_install.sh

COPY ./asset/prisma ./prisma
COPY ./conf/prisma_install.sh .
RUN chmod +x prisma_install.sh && ./prisma_install.sh

COPY ./conf/entrypoint.sh .
COPY ./asset/srcs ./srcs
COPY ./asset/tsconfig.json .
RUN chmod +x entrypoint.sh 

ENTRYPOINT ["./entrypoint.sh"]