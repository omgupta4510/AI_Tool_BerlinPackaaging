# Frontend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build


# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
