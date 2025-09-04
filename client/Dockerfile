# Build stage
FROM node:20-bookworm-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# สร้างไฟล์ production โดยใช้ .env.production
RUN npm run build

# Serve stage
FROM nginx:alpine

# คัดลอกไฟล์ build ไปยังโฟลเดอร์ที่ Nginx เสิร์ฟ
COPY --from=builder /app/dist /usr/share/nginx/html

# default.conf จะถูก mount จากโฮสต์ผ่าน docker-compose (nginx.conf)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]