# 1. Use Node.js 20 (Alpine is a lightweight version)
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first (Optimization: This layer is cached if packages don't change)
COPY package*.json ./

# 4. Install dependencies (Clean install for production)
RUN npm ci

# 5. Copy the Prisma Schema specifically (Needed for generation)
COPY prisma ./prisma/

# 6. Generate the Prisma Client
RUN npx prisma generate

# 7. Copy the rest of the source code
COPY . .

# 8. Build the TypeScript code into JavaScript
RUN npm run build

# 9. Expose the port the app runs on
EXPOSE 3000

# 10. Start the server (Using the built JS files)
CMD ["npm", "start"]