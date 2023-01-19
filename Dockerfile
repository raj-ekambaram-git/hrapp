# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

# You can use "node:12" or your custom image as a base image of course.
# We chose this to avoid Docker Hub's throttling during the tutorial steps.
FROM 082388193175.dkr.ecr.us-east-1.amazonaws.com/awsfusionruntime-nodejs16:16.19.0

# You can remove this "RUN" instruction if you use a base image with
# Node.js 12 installation.
RUN yum install atk java-atk-wrapper at-spi2-atk gtk3 libXt libdrm mesa-libgbm

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
EXPOSE 80

CMD [ "npm", "start" ]