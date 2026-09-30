# SprintMart - production-style container image.
#
# This builds the app itself (no dev tooling, no Playwright browsers) into a
# small image so Jenkins can run it as a persistent "staging" container,
# separate from the ephemeral instance Playwright spins up for local/CI runs.

FROM node:22-slim

WORKDIR /app

# Install only production dependencies - keeps the image small and matches
# how a real deployment would install (no devDependencies like Playwright).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Now bring in the application code.
COPY db ./db
COPY src ./src
COPY public ./public

# The SQLite file lives inside the container - fine for a training "staging"
# environment. Seed it at container startup (not build time), so a fresh
# container always starts from known demo data.
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "npm run seed && npm start"]