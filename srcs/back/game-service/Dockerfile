FROM node:23-alpine

WORKDIR  /usr/src/game-service

RUN apk update --no-cache && \
    apk add sqlite openssl pnpm --no-cache

ARG DATABASE_URL
ARG NODE_ENV
COPY ./asset/package.json .
COPY ./conf/pnpm_install.sh .
RUN chmod +x pnpm_install.sh && ./pnpm_install.sh

COPY ./asset/prisma ./prisma
COPY ./asset/tsconfig.json .
COPY ./conf/prisma_install.sh .
RUN chmod +x prisma_install.sh && ./prisma_install.sh

COPY ./conf/entrypoint.sh .
COPY ./asset/srcs ./srcs
RUN chmod +x entrypoint.sh 

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]