FROM node:alpine

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --production

COPY . /app/

CMD yarn start