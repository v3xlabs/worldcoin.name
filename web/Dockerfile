FROM node:alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm

COPY package.json package.json

RUN pnpm install

COPY . /app

RUN pnpm build

EXPOSE 3000

CMD pnpm start