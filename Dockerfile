# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies by copying the package files first
COPY package*.json ./
RUN npm install

# Bundle app source inside Docker image
COPY . .


# Run the app when the container launches
CMD ["npm", "start"]
