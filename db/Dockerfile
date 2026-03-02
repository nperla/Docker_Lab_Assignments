FROM postgres:15-alpine

ENV LANG en_US.utf8
ENV POSTGRES_INITDB_ARGS="--encoding=UTF-8"

COPY init.sql /docker-entrypoint-initdb.d/01-init.sql

EXPOSE 5432
