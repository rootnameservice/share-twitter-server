FROM node:16 AS builder

WORKDIR /app

COPY . .

RUN npm run build

EXPOSE 3001

RUN npm start:prod