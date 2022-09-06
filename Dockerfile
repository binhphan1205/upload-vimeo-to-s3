FROM public.ecr.aws/docker/library/node:16-alpine as builder
RUN apk add --no-cache --update python3 py3-pip alpine-sdk vips-tools vips-dev glib-dev autoconf automake nasm libpng-dev libtool util-linux
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
CMD ["sh", "-c", "npm run build && npm start"]