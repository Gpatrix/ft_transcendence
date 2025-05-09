FROM node:23-alpine

WORKDIR  /usr/src/chat-service

RUN apk update --no-cache && \
    apk add sqlite openssl --no-cache

    
ARG DATABASE_URL
COPY ./asset/package.json .
COPY ./conf/npm_install.sh .
RUN chmod +x npm_install.sh && ./npm_install.sh

COPY ./asset/prisma .
COPY ./conf/prisma_install.sh .
RUN chmod +x prisma_install.sh && ./prisma_install.sh

COPY ./conf/entrypoint.sh .
COPY ./asset/srcs ./srcs
RUN chmod +x entrypoint.sh 

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]