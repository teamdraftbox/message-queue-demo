FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
ENV CLOUDAMQP_URL=amqp://mirjvqap:J2l7YaXcAXwBUqZrLdlRhQ1fSFGik6eo@barnacle.rmq.cloudamqp.com/mirjvqap
ENV DB_NAME=demo
ENV DB_PASSWORD=idea1234
ENV PORT=8080
ENV SECRET=hashtag
RUN npm install 
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]