ARG APP_VERSION
ARG NODE_VERSION=22.16.0
ARG SQUID_CLI_VERSION=3.3.5

FROM node:${NODE_VERSION}-alpine AS builder

ARG SQUID_CLI_VERSION

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm i -g @subsquid/cli@${SQUID_CLI_VERSION}
COPY . .
RUN sqd build

FROM node:${NODE_VERSION}-alpine

ARG NODE_VERSION
ARG SQUID_CLI_VERSION

LABEL maintainer="QF Network <admin@qfnetwork.xyz>" \
      node.version="${NODE_VERSION}" \
      squid.cli.version="${SQUID_CLI_VERSION}" \
      description="QF Squid"

WORKDIR /app

RUN npm i -g @subsquid/cli@${SQUID_CLI_VERSION}
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/db ./db
COPY --from=builder /app/schema.graphql ./
COPY package*.json commands.json ./