FROM docker.io/node:23-alpine3.20
LABEL maintainer="Andrei Orlov <aaorlov1@gmail.com>"
LABEL description="QF Squid"

WORKDIR /app

COPY . . 

RUN npm install && \
    npm i -g @subsquid/cli && \
    sqd build

CMD ["sqd", "run", "."]
