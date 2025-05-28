FROM alpine:3.21.3

WORKDIR  /usr/src/grafana-service

RUN apk update --no-cache && \
    apk add grafana envsubst openssl --no-cache


RUN mkdir -p /etc/grafana/ssl     && \
 openssl req -x509 -nodes \
-out /etc/grafana/ssl/ft_transcendence.crt \
-keyout /etc/grafana/ssl/ft_transcendence.key \
-subj "/C=FR/ST=IDF/L=le havre/O=42/OU=42/CN=lchauvet.42.fr/UID=lchauvet"

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