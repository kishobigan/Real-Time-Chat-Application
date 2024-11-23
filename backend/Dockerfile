FROM ubuntu:latest
LABEL authors="kishobigan"

ENTRYPOINT ["top", "-b"]

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]