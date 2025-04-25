FROM node:20-alpine

WORKDIR  /usr/src/chat-service

RUN apk update --no-cache && \
    apk add sqlite openssl --no-cache

COPY ./conf/entrypoint.sh .
COPY ./asset ./asset
RUN chmod +x entrypoint.sh 

ARG DATABASE_URL

COPY ./conf/install.sh .
RUN chmod +x install.sh
RUN ./install.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]