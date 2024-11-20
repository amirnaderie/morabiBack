FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apk update && apk add ffmpeg

RUN chown -R 777 node:node /app

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "npm","run", "start" ]
