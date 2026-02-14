FROM oven/bun:1-alpine

WORKDIR /app

# Copy dependency files first for better caching
COPY package.json bun.lock* ./

# Install dependencies - this layer will be cached unless package.json changes
RUN bun install

# Copy the rest of the application
COPY . .

EXPOSE 5173

# Ensure node_modules are available and start the dev server
CMD ["bun", "run", "dev"]
