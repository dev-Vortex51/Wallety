# 1. Use Node 20 Slim (Debian based - better for Prisma)
FROM node:20-slim

# 2. Install OpenSSL (Required for Prisma)
RUN apt-get update -y && apt-get install -y openssl

# 3. Set working directory
WORKDIR /app

# 4. Copy package files
COPY package*.json ./

# 5. Install dependencies
RUN npm ci

# 6. Copy Prisma schema
COPY prisma ./prisma/

# 7. Generate Prisma Client
RUN npx prisma generate

# 8. Copy source code
COPY . .

# 9. Build TypeScript
RUN npm run build

# 10. Expose port
EXPOSE 3000

# 11. Start server
CMD ["npm", "start"]