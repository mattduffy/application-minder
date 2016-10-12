FROM node:argon
MAINTAINER Matthew Duffy <mattduffy@gmail.com>

ENV INSTALL_PATH=/webapp
ENV INDEX_FILE=index.js
ENV PORT=5000

# Create the app directory
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

# Move source files into app directory
COPY package.json package.json
RUN npm install

COPY . .

# Declare any peristent volumes here


# Port number
EXPOSE $PORT
CMD ['node', $INDEX_FILE]



