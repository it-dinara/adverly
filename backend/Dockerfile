# Use an official Node.js runtime as a parent image
FROM node:24-slim

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire backend code into the container
COPY . .

# Expose the necessary port
EXPOSE 3000

# Start the backend service
CMD ["node", "app.js"]
