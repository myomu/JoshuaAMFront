# Node.js 18 이미지를 사용하여 빌드
FROM node:18 AS build

ARG REACT_APP_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Nginx 이미지를 사용하여 빌드된 정적 파일 제공
FROM nginx:latest

ENV REACT_APP_API_URL=${REACT_APP_API_URL}

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]