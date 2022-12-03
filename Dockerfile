FROM node:17-alpine

RUN apk update
RUN apk add git

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn","start"]