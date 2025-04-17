FROM node:20-alpine

WORKDIR  /usr/src/api_gateway

RUN apk update --no-cache && \
    apk add sqlite openssl --no-cache

RUN mkdir -p /usr/src/api_gateway/prisma/db

# COPY ./asset/ .

COPY ./entrypoint.sh .
RUN chmod +x entrypoint.sh

# RUN npm install --omit=dev && npm run build


RUN if [ "$NODE_ENV" = "dev" ]; \
then npm install; \
else npm install --omit=dev && npm run build; \
fi

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]