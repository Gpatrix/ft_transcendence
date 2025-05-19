FROM alpine:3.21.3

WORKDIR  /usr/src/grafana-service

RUN apk update --no-cache && \
    apk add grafana --no-cache

COPY ./conf/entrypoint.sh .
RUN chmod +x entrypoint.sh 

ENTRYPOINT ["./entrypoint.sh"]