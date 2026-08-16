FROM node:20-alpine

WORKDIR /app

# Copy only package files first so npm install is cached separately
# from source changes (faster rebuilds when you only edit .jsx files)
COPY package.json ./
RUN npm install

# Source itself is bind-mounted by docker-compose, not baked into the image
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]