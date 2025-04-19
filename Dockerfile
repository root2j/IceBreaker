# Use an official Node.js runtime as a parent image
# Using alpine for a smaller image size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install app dependencies using the clean install command
# Use --production to only install production dependencies
RUN npm ci --production

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable (optional, Vercel handles this)
# ENV NODE_ENV=production

# Define the command to run your app
CMD [ "node", "server.js" ]
