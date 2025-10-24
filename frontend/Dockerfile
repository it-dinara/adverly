# Use an official Node.js runtime
FROM node:24-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code
COPY . .

# Build the frontend
RUN npm run build

# Expose the frontend port
EXPOSE 8081

# Start Webpack Dev Server when the container runs
CMD ["npm", "run", "start"]
