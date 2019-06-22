FROM node:12-alpine

# Install Linux dependencies
RUN apk add --update \
    bash

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn

# Bundle app source
COPY . .

# Expose port and run server
EXPOSE 3333

CMD yarn start:prod