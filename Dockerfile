FROM node:14-alpine3.10 as ts-compiler
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
CMD ["sh", "-c", "npm run build && npm start"]