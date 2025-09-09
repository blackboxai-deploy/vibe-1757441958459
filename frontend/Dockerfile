# Frontend Dockerfile
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ENV REACT_APP_BACKEND_URL=http://localhost:8001
ENV GENERATE_SOURCEMAP=false
ENV CI=false

# Build the application
RUN yarn build

# Production stage with nginx
FROM nginx:alpine

# Copy build files to nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]