FROM alpine:3.21.3

WORKDIR  /usr/src/grafana-service

RUN apk update --no-cache && \
<<<<<<< Updated upstream
    apk add grafana --no-cache
=======
    apk add grafana envsubst --no-cache


ARG GRAFANA_DB_USER
ARG GRAFANA_DB_PASSWORD
ARG GRAFANA_ADMIN_USER
ARG GRAFANA_ADMIN_PASSWORD
ARG GRAFANA_ADMIN_EMAIL
ARG GRAFANA_ADMIN_SECRET_KEY
COPY ./asset/default.ini .
COPY ./conf/setup_grafana.sh .
RUN chmod +x setup_grafana.sh && ./setup_grafana.sh
>>>>>>> Stashed changes

COPY ./conf/entrypoint.sh .
RUN chmod +x entrypoint.sh 

ENTRYPOINT ["./entrypoint.sh"]