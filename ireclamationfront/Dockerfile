# Stage 1: Build the Angular app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app in production mode
RUN npm run build --configuration=production

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app to Nginx's public directory
COPY --from=build /app/dist/ireclamationfront /usr/share/nginx/html

# Optional: custom Nginx config for SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
