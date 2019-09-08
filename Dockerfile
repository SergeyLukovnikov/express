FROM node:10-alpine

# Create work directory
WORKDIR /usr/src/app

# Install Python and Yarn
RUN apk add g++ make python && npm install yarn -g

# Copy app source to work directory
COPY . /usr/src/app

# Install app dependencies
RUN yarn install

# Build and run the app
CMD npm start serve
