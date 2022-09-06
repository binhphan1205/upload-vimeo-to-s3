FROM public.ecr.aws/docker/library/node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
CMD ["sh", "-c", "npm run build && npm start"]