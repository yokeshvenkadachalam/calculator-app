
# Use an official Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application files
COPY . .

# Document the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
