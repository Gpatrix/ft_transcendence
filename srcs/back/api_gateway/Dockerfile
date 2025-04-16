FROM alpine:3.21.3

WORKDIR /usr/src/api_gateway

RUN apk update --no-cache && \
    apk add nodejs npm sqlite --no-cache && \
    npm install fastify && \
    npm i -D typescript @types/node && \
    npm i prisma -D

COPY ./asset/* .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm",  "run", "start"]