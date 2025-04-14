FROM alpine:3.21.3

WORKDIR /usr/src/server

RUN apk update --no-cache && \
    apk add nodejs npm --no-cache && \
    npm i fastify