FROM node:18-alpine

WORKDIR /app
COPY package.json .
RUN yarn install
COPY index.js .

EXPOSE 9000

CMD ["node", "/app/index.js"]
