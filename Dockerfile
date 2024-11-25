FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apk update && apk add ffmpeg
#RUN addgroup -S node && adduser -S node -G node
#RUN chown -R 777 node:node /*
## RUN chmod -R 777 /app

#USER node

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "npm","run", "start" ]