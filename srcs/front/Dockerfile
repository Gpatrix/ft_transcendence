FROM alpine:3.21.3
WORKDIR /var/www/html

RUN apk update --no-cache && \ 
 apk add nodejs pnpm curl --no-cache

ARG NODE_ENV
COPY ./asset/package.json .
COPY ./conf/pnpm_install.sh .
RUN chmod +x pnpm_install.sh && ./pnpm_install.sh

COPY ./asset/ .

COPY ./conf/vite.sh /tmp
RUN chmod +x /tmp/vite.sh

EXPOSE 5173

ENTRYPOINT ["sh", "/tmp/vite.sh"]