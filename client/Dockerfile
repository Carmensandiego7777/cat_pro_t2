    # Use the official Node.js 14 image as a base image
    FROM node:21

    # Set the working directory in the container
    WORKDIR /client

    # Copy package.json and package-lock.json to the working directory
    COPY package*.json ./

    # Install dependencies
    RUN npm install serve -g

    # Copy the rest of the application code to the working directory
    COPY . .

    # Build the React app
    RUN npm run build

    # Expose port 3000 to the outside world
    EXPOSE 3000

    # Command to run the application
   CMD ["serve", "-s", "dist"]