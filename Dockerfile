# 1. Base image
FROM node:20-alpine

# 2. Create folder in container
WORKDIR /app

# 3. Copy package.json package-lock.json
COPY package*.json ./

# 4. Install dependency
RUN npm install

# 5. Copy full source code
COPY . .

# 6. Build NestJS
RUN npm run build

# 7. Expose port
EXPOSE 3000

# 8. Run the application
CMD ["node", "dist/main.js"]