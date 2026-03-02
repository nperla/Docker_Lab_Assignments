# ─── Stage 1: Install production dependencies ────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ─── Stage 2: Lean runtime image ─────────────────────────────────────────────
FROM node:18-alpine AS runtime
WORKDIR /app

# Non-root user for security
RUN addgroup -S shopwave && adduser -S shopwave -G shopwave

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=shopwave:shopwave src/ ./src/
COPY --chown=shopwave:shopwave package.json ./

USER shopwave
EXPOSE 5000
CMD ["node", "src/server.js"]
