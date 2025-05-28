FROM alpine:3.21.3

WORKDIR /usr/src/ft_transcendence

RUN apk update --no-cache
RUN apk add nginx openssl --no-cache

RUN mkdir -p /etc/nginx/ssl     \
             /var/run/nginx

RUN openssl req -x509 -nodes \
-out /etc/nginx/ssl/ft_transcendence.crt \
-keyout /etc/nginx/ssl/ft_transcendence.key \
-subj "/C=FR/ST=IDF/L=le havre/O=42/OU=42/CN=lchauvet.42.fr/UID=lchauvet"

COPY conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 443

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]