FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json tsconfig.json package-lock.json ./

RUN npm ci

COPY ./src ./src

RUN npm run build

WORKDIR /usr/src/app/dist

CMD ["node", "server.js"]

EXPOSE 8080