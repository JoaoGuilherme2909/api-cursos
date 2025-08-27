FROM node:22-alpine AS builder

WORKDIR /app

COPY . ./

RUN npm install -g pnpm

RUN pnpm i -P

EXPOSE 3333

CMD ["node", "src/server.ts"]
