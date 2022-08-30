FROM --platform=linux/amd64 node:16
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
CMD ["sh", "-c", "npm run build && npm start"]