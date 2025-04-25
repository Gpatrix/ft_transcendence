FROM node:20-alpine

WORKDIR  /usr/src/chat-service

RUN apk update --no-cache && \
    apk add sqlite openssl --no-cache

COPY ./conf/entrypoint.sh .
COPY ./conf/build.sh .
RUN chmod +x entrypoint.sh build.sh

COPY ./asset ./asset

RUN ./build.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]