FROM node:16

COPY . /app

WORKDIR /app

RUN yum install libatk-bridge2.0-0

RUN rm -rf node_modules && npm install && npm run build

EXPOSE 3000
CMD [ "node", "index.js" ]