FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy the application source code and build configuration files
COPY . .

# Compile TypeScript to JavaScript if necessary
RUN npm run build  # Only if you need a build step

# Expose the application port
EXPOSE 3000

# Run the application
CMD [ "node", "dist/index.js" ]
