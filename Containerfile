ARG APP_VERSION
ARG NODE_VERSION=22.16.0

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm i -g @subsquid/cli
COPY . .
RUN sqd build

FROM node:${NODE_VERSION}-alpine

ARG NODE_VERSION

LABEL maintainer="QF Network <admin@qfnetwork.xyz>" \
      node.version="${NODE_VERSION}" \
      description="QF Squid"

WORKDIR /app

RUN npm i -g @subsquid/cli

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/db ./db
COPY package*.json commands.json ./