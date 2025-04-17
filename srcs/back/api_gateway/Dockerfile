FROM node:20-alpine

WORKDIR  /usr/src/api_gateway

RUN apk update --no-cache && \
    apk add sqlite openssl --no-cache

COPY ./entrypoint.sh .
RUN chmod +x entrypoint.sh

COPY ./asset ./asset

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]