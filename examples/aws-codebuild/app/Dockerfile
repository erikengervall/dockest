FROM node:12-alpine

COPY package.json /app/package.json
RUN sh -c "cd /app && yarn install" 
COPY index.js /app/index.js

EXPOSE 9000

CMD ["node", "/app/index.js"]
