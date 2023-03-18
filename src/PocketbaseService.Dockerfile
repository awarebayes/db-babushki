FROM golang:latest

WORKDIR /home/node/app/

COPY ./pocketbase_service ./pocketbase_service

WORKDIR ./pocketbase_service

RUN go build ppo


