FROM node:20-alpine

WORKDIR  /usr/src/chat-service

RUN apk update --no-cache && \
    apk add sqlite openssl --no-cache

COPY ./asset ./asset


ARG DATABASE_URL
COPY ./conf/install.sh .
RUN chmod +x install.sh
RUN ./install.sh

COPY ./conf/entrypoint.sh .
RUN chmod +x entrypoint.sh 

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
