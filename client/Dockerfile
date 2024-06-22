# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install

# Copy the Next.js project code into the container
COPY . /app/

# Build the Next.js application
RUN pnpm run build

# Expose the port that Next.js runs on
EXPOSE 3000

# Run Next.js app
CMD ["pnpm", "start"]
