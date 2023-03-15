FROM node:latest

WORKDIR /home/node/app/

COPY ./package.json ./

RUN npm install




