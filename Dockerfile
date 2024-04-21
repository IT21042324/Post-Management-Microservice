# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Set environment variables
ARG PORT
ARG URI
ARG SECRET
ARG DOCKER_USERNAME
ARG DOCKER_PASSWORD
ENV PORT=$PORT
ENV URI=$URI
ENV SECRET=$SECRET
ENV DOCKER_USERNAME=$DOCKER_USERNAME
ENV DOCKER_PASSWORD=$DOCKER_PASSWORD
ENV BACKENDURI=${BACKEND_URI}

# Install app dependencies by copying the package files first
COPY package*.json ./
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]
