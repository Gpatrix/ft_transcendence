FROM alpine:3.21.3

WORKDIR /usr/src/api_gateway

RUN apk update --no-cache && \
    apk add nodejs npm --no-cache && \
    npm install fastify

COPY ./asset/test.js .

EXPOSE 3000

ENTRYPOINT ["node", "test.js"]