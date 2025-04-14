FROM alpine:3.21.3

WORKDIR /usr/src/server

RUN apk update --no-cache
RUN apk add nginx openssl --no-cache

RUN mkdir -p /etc/nginx/ssl     \
             /etc/nginx/ssl     \
             /var/run/nginx

RUN openssl req -x509 -nodes \
-out /etc/nginx/ssl/server.crt \
-keyout /etc/nginx/ssl/server.key \
-subj "/C=FR/ST=IDF/L=le havre/O=42/OU=42/CN=lchauvet.42.fr/UID=lchauvet"

# RUN chmod 755 /var/www/wordpress

COPY conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 443
# EXPOSE 9000

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]