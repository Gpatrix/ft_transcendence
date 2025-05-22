FROM alpine:3.21.3

WORKDIR  /usr/src/grafana-service

RUN apk update --no-cache && \
    apk add grafana envsubst --no-cache


ARG GRAFANA_DB_USER
ARG GRAFANA_DB_PASSWORD
ARG GRAFANA_ADMIN_USER
ARG GRAFANA_ADMIN_PASSWORD
ARG GRAFANA_ADMIN_EMAIL
ARG GRAFANA_ADMIN_SECRET_KEY
COPY ./asset/defaults.conf .
COPY ./conf/config_grafana.sh .
RUN chmod +x config_grafana.sh && ./config_grafana.sh

COPY ./asset/datasources.yml /usr/share/grafana/conf/provisioning/datasources/.
COPY ./asset/default.yaml /usr/share/grafana/conf/provisioning/dashboards/.
COPY ./asset/ft_transcendence.json /var/lib/grafana/dashboards/.

COPY ./conf/entrypoint.sh .
RUN chmod +x entrypoint.sh 

ENTRYPOINT ["./entrypoint.sh"]