FROM node:22.16.0
LABEL maintainer="QF Network <admin@qf.network>"
LABEL description="QF Squid"

WORKDIR /app

COPY . .

RUN npm install && \
    npm i -g @subsquid/cli && \
    sqd build
