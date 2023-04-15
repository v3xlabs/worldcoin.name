FROM node:alpine

RUN npm i -g pnpm

WORKDIR /app

COPY package.json

RUN pnpm install

COPY . .

CMD pnpm start