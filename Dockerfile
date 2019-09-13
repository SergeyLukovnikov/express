FROM node:10-alpine

# Create work directory
WORKDIR /usr/app

# Install Python and Yarn
RUN apk add g++ make python

# Copy app source to work directory
COPY . /usr/app

# Install app dependencies
RUN yarn install --production && npm run build && rm -rf ./src

# Build and run the app
CMD npm start
