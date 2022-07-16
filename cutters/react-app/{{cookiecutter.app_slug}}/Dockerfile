# BASE-------------------------------------------------

FROM node:16-buster-slim as base

RUN apt-get update

RUN mkdir /app
WORKDIR /app


# DEV-------------------------------------------------

FROM base as dev

EXPOSE 8080
EXPOSE 8088
