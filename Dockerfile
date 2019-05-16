FROM node:11

# Install Linux dependencies
#RUN apt-get update && apt-get install -y \
#    supervisor

# Install Adonis CLI
RUN yarn global add \
    @adonisjs/cli \
    nodemon

# Create app directory
WORKDIR /usr/src/app

# Copy supervisor config
#COPY adonis-scheduler.conf /etc/supervisor.d/adonis-scheduler.ini

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Bundle app source
COPY . .

# Setup environment variables
RUN cp .env.example .env \
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
 && sed -i "s,^MAIL_FROM_ADDRESS=,MAIL_FROM_ADDRESS=$MAIL_FROM_ADDRESS," .env \
 && sed -i "s,^SMTP_HOST=,SMTP_HOST=$SMTP_HOST," .env \
 && sed -i "s,^SMTP_PORT=,SMTP_PORT=$SMTP_PORT," .env \
 && sed -i "s,^MAILGUN_API_KEY=,MAILGUN_API_KEY=$MAILGUN_API_KEY," .env \
 && sed -i "s,^MAILGUN_DOMAIN=,MAILGUN_DOMAIN=$MAILGUN_DOMAIN," .env \
 && sed -i "s,^SPACES_KEY=,SPACES_KEY=$SPACES_KEY," .env \
 && sed -i "s,^SPACES_SECRET=,SPACES_SECRET=$SPACES_SECRET," .env \
 && sed -i "s,^SPACES_ENDPOINT=,SPACES_ENDPOINT=$SPACES_ENDPOINT," .env \
 && sed -i "s,^SPACES_BUCKET=,SPACES_BUCKET=$SPACES_BUCKET," .env \
 && sed -i "s,^SPACES_REGION=,SPACES_REGION=$SPACES_REGION," .env \
 && sed -i "s,^TWILIO_SID=,TWILIO_SID=$TWILIO_SID," .env \
 && sed -i "s,^TWILIO_FROM=,TWILIO_FROM=$TWILIO_FROM," .env \
 && sed -i "s,^TWILIO_TOKEN=,TWILIO_TOKEN=$TWILIO_TOKEN," .env \
 && sed -i "s,^STRIPE_API_KEY=,STRIPE_API_KEY=$STRIPE_API_KEY," .env \
 && sed -i "s,^ONESIGNAL_APP_ID=,ONESIGNAL_APP_ID=$ONESIGNAL_APP_ID," .env \
 && sed -i "s,^ONESIGNAL_AUTH_KEY=,ONESIGNAL_AUTH_KEY=$ONESIGNAL_AUTH_KEY," .env \
 && sed -i "s,^ONESIGNAL_REST_API_KEY=,ONESIGNAL_REST_API_KEY=$ONESIGNAL_REST_API_KEY," .env \
 && sed -i "s,^AWS_ACCESS_KEY_ID=,AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID," .env \
 && sed -i "s,^AWS_SECRET_ACCESS_KEY=,AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY," .env \
 && sed -i "s,^AWS_API_VERSION=,AWS_API_VERSION=$AWS_API_VERSION," .env \
 && sed -i "s,^AWS_REGION=,AWS_REGION=$AWS_REGION," .env \
 && sed -i "s,^BUGSNAG_API_KEY=,BUGSNAG_API_KEY=$BUGSNAG_API_KEY," .env

# Expose port and run server
EXPOSE 3333

CMD adonis serve
