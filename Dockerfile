FROM public.ecr.aws/docker/library/node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD ["sh", "-c", "npm start"]