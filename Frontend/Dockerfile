# Frontend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
# RUN npm run build
ENV HOST=0.0.0.0

# Expose port
EXPOSE 5173

CMD ["npm", "run", "dev"]