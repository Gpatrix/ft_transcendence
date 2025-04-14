FROM alpine:3.21.3

WORKDIR /usr/src/api_gateway

RUN apk update --no-cache && \
    apk add nodejs npm --no-cache && \
    npm i fastify

ENTRYPOINT ["sleep", "infinity"]