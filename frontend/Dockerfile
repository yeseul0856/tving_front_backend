# 1) 빌드 스테이지: React(Vite) 정적 파일 생성
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) 실행 스테이지: nginx 가 정적 파일 서빙 + /api 를 backend 컨테이너로 프록시
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
