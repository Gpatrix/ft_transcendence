FROM alpine:3.21.3

WORKDIR /usr/src/api_gateway

RUN apk update --no-cache && \
    apk add nodejs npm --no-cache && \
    npm install fastify && \
    npm i -D typescript @types/node

COPY ./asset/test.ts .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm",  "run", "start"]