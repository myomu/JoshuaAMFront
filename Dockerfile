# Node.js 18 이미지를 사용하여 빌드
FROM node:alpine as builder

WORKDIR /app

# package.json과 package-lock.json을 복사한 후 종속성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 및 .env 파일 복사하고 빌드
COPY . .
RUN npm run build

# Nginx 이미지를 사용하여 빌드된 정적 파일 제공
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 기본 설정 유지, 80 포트 사용
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]