# ===========================================
# STAGE 1: BUILD STAGE - Create production build
# ===========================================

# Use Node.js 20 Alpine image as the base for building the React app
FROM node:20-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files first (for better Docker layer caching)
COPY package*.json ./

# Install all dependencies defined in package.json
RUN npm install

# Accept build-time arguments for environment variables (passed when building the Docker image)
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}    
ARG VITE_PAYPAL_CLIENT_ID
ENV VITE_PAYPAL_CLIENT_ID=${VITE_PAYPAL_CLIENT_ID}   

# Copy all source code files to the container
COPY . .

# Build the React app for production (creates optimized static files in /app/dist)
RUN npm run build     

# ===========================================
# STAGE 2: PRODUCTION STAGE - Serve static files
# ===========================================

# Use lightweight Nginx Alpine image to serve the built React app
FROM nginx:alpine

# Copy the built React app from the build stage to Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx server in the foreground (required for Docker containers)
CMD ["nginx", "-g", "daemon off;"]  

