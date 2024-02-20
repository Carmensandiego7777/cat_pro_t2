# Use the official Node.js 14 image as a base image
FROM node:21

# Set the working directory in the container
WORKDIR /backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Build the application (if necessary)
RUN npm i

# Expose the port that your backend application is listening on
EXPOSE 5500

# Command to run the application
CMD ["node", "index.js"]  # Assuming app.js is the entry point for your backend application
