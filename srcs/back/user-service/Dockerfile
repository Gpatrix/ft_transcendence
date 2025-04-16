FROM alpine:3.21.3

WORKDIR /usr/src/api_gateway

RUN apk update --no-cache && \
    apk add nodejs npm --no-cache && \
    npm install fastify && \
    npm i -D typescript @types/node \
    apk add  --no-cache sqlite \ 
    npm i prisma -D

COPY ./asset/* .
RUN npm run db:migrate
RUN npm run build

EXPOSE 3001

ENTRYPOINT ["npm",  "run", "start"]