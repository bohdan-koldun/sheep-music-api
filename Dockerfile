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

# Setup environment variables
RUN cp .env.example .env \
 && sed -i "s,^PORT=,PORT=$PORT," .env \
 && sed -i "s,^NODE_ENV=,NODE_ENV=$NODE_ENV," .env \
 && sed -i "s,^APP_URL=,APP_URL=$APP_URL," .env \
 && sed -i "s,^APP_KEY=,APP_KEY=$APP_KEY," .env \
 && sed -i "s,^DB_HOST=,DB_HOST=$DB_HOST," .env \
 && sed -i "s,^DB_USER=,DB_USER=$DB_USER," .env \
 && sed -i "s,^DB_PASSWORD=,DB_PASSWORD=$DB_PASSWORD," .env \
 && sed -i "s,^DB_DATABASE=,DB_DATABASE=$DB_DATABASE," .env \
 && sed -i "s,^MAIL_CONNECTION=,MAIL_CONNECTION=$MAIL_CONNECTION," .env \
 && sed -i "s,^MAIL_USERNAME=,MAIL_USERNAME=$MAIL_USERNAME," .env \
 && sed -i "s,^MAIL_PASSWORD=,MAIL_PASSWORD=$MAIL_PASSWORD," .env \
 && sed -i "s,^MAIL_FROM=,MAIL_FROM=$MAIL_FROM," .env \
 && sed -i "s,^SMTP_HOST=,SMTP_HOST=$SMTP_HOST," .env \
 && sed -i "s,^SMTP_PORT=,SMTP_PORT=$SMTP_PORT," .env \
 && sed -i "s,^SPACES_KEY=,SPACES_KEY=$SPACES_KEY," .env \
 && sed -i "s,^SPACES_SECRET=,SPACES_SECRET=$SPACES_SECRET," .env \
 && sed -i "s,^SPACES_ENDPOINT=,SPACES_ENDPOINT=$SPACES_ENDPOINT," .env \
 && sed -i "s,^SPACES_URL=,SPACES_URL=$SPACES_URL," .env \
 && sed -i "s,^SPACES_REGION=,SPACES_REGION=$SPACES_REGION," .env \
 && sed -i "s,^SPACES_BUCKET=,SPACES_BUCKET=$SPACES_BUCKET," .env

# Expose port and run server
EXPOSE 3333

CMD yarn start:prod
