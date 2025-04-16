FROM alpine:3.21.3

WORKDIR  /usr/src/api_gateway

RUN apk update --no-cache && \
    apk add nodejs npm sqlite --no-cache

COPY ./asset/ .
RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm",  "run", "start"]