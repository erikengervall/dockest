# https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

RUN npm install

COPY . .

CMD [ "node", "./index" ]
