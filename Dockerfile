FROM node:16

RUN apt-get update && apt-get install -y unzip gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libgbm-dev libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

WORKDIR /app

COPY . /app

# RUN apt-get install -y libgbm-dev

RUN npm install && NODE_ENV=npm run build

EXPOSE 3000
CMD [ "npm", "start" ]