FROM node:20-alpine AS build

WORKDIR /app

COPY src ./src
COPY config ./config
COPY index.html ./
COPY package*.json ./

RUN npm ci

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine-slim

COPY --from=build /app/dist /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]