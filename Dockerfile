FROM node:22-alpine

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Push DB schema and start the app
# Railway sets PORT dynamically - next start respects PORT env var
CMD ["sh", "-c", "npx prisma db push && npx next start -H 0.0.0.0 -p ${PORT:-3000}"]
