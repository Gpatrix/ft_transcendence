FROM alpine:3.21.3

RUN apk update --no-cache
RUN apk add nodejs npm curl --no-cache
RUN mkdir -p /var/www/html

WORKDIR /var/www/html
COPY ./tools/vite.sh /tmp
RUN chmod +x /tmp/vite.sh

ENTRYPOINT ["sh", "/tmp/vite.sh"]