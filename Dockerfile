# Multi-stage Dockerfile for vision-parking-api
# Stage 1: Base image with dependencies
FROM node:18-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Stage 2: Dependencies installation
FROM base AS deps

# Install all dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Stage 3: Build stage
FROM base AS builder

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and configuration files
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript application
RUN pnpm run build

# Stage 4: Production dependencies
FROM base AS prod-deps

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Stage 5: Runtime stage
FROM node:18-alpine AS runtime

# Install pnpm for potential runtime operations
RUN npm install -g pnpm

# Create a non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

# Set working directory
WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy Prisma files for migrations and client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

# Copy package.json for metadata
COPY --from=builder /app/package.json ./

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

EXPOSE 30000

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:30000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "dist/index.js"]
