FROM node:alpine as builder

WORKDIR /app

# package.json과 package-lock.json을 복사한 후 종속성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 및 .env 파일 복사하고 빌드
COPY . .
RUN npm run build

# 빌드된 정적 파일만을 제공
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/build /app/build

EXPOSE 3000