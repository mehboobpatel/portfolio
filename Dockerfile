# Stage 1: Build the Gatsby project
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy all files to the container
COPY . .

# Install dependencies and build the project
RUN npm install -g gatsby-cli \
    && npm install \
    && gatsby build

# Stage 2: Serve the Gatsby project with a smaller image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install gatsby-cli to serve the built project
RUN npm install -g gatsby-cli

# Copy only the built output and necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/static ./static
COPY --from=builder /app/gatsby-config.js ./gatsby-config.js
COPY --from=builder /app/gatsby-node.js ./gatsby-node.js
COPY --from=builder /app/gatsby-ssr.js ./gatsby-ssr.js
COPY --from=builder /app/gatsby-browser.js ./gatsby-browser.js

#TO SAVE 21MB use the below COPY INSTRUCTION
#COPY --from=builder /app/public /app/content /app/package*.json /app/node_modules /app/src /app/static /app/gatsby-config.js /app/gatsby-node.js /app/gatsby-ssr.js /app/gatsby-browser.js ./

# Expose the port Gatsby serves on
EXPOSE 8000

# Start the Gatsby server
CMD ["gatsby", "serve", "-H", "0.0.0.0", "-p", "8000"]
