FROM node:hydrogen-alpine3.17

WORKDIR /home/node/app/

COPY ./package.json ./

RUN npm install




