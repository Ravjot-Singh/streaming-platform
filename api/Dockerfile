FROM node:20-alpine
 
WORKDIR /app
 
COPY package.json ./
RUN npm install
 
# Source is bind-mounted by docker-compose - not baked into the image
EXPOSE 3000
 
CMD ["npm", "run", "dev"]
 