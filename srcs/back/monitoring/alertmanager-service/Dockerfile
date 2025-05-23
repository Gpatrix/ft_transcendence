FROM alpine:3.21.3

WORKDIR  /usr/src/alertmanager-service

RUN apk update --no-cache && \
    apk add alertmanager envsubst --no-cache

COPY ./asset/ .


COPY ./conf/config_alertmanager.sh .
RUN chmod +x config_alertmanager.sh && ./config_alertmanager.sh

COPY ./conf/entrypoint.sh .
RUN chmod +x entrypoint.sh 

ENTRYPOINT ["./entrypoint.sh"]