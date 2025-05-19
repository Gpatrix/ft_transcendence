FROM alpine:3.21.3

WORKDIR  /usr/src/prometheus-service

RUN apk update --no-cache && \
    apk add prometheus --no-cache

COPY ./asset/prometheus.yml .

COPY ./conf/entrypoint.sh .
RUN chmod +x entrypoint.sh 

ENTRYPOINT ["./entrypoint.sh"]