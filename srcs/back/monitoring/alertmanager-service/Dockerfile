FROM alpine:3.21.3

WORKDIR  /usr/src/alertmanager-service

RUN apk update --no-cache && \
    apk add alertmanager envsubst --no-cache

COPY ./asset/ .

ARG ALERTMANAGER_SMTP_SMARTHOST
ARG ALERTMANAGER_SMTP_FROM
ARG ALERTMANAGER_SMTP_AUTH_USERNAME
ARG ALERTMANAGER_SMTP_AUTH_PASSWORD
ARG ALERTMANAGER_TARGET_MAIL
COPY ./conf/config_alertmanager.sh .
RUN chmod +x config_alertmanager.sh && ./config_alertmanager.sh

COPY ./conf/entrypoint.sh .
RUN chmod +x entrypoint.sh 

EXPOSE 9093

ENTRYPOINT ["./entrypoint.sh"]