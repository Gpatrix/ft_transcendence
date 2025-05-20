#!/bin/sh

exec grafana server -homepath /usr/share/grafana/ -config ./grafana.conf

# envsubst