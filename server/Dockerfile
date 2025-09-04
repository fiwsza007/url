# ใช้ Debian-based image เพื่อรองรับ better-sqlite3 binary ได้ง่ายกว่า Alpine
FROM node:20-bookworm-slim

WORKDIR /app

# ติดตั้ง dependencies ตาม package.json ก่อน เพื่อ cache layer
COPY package*.json ./
RUN npm ci --omit=dev

# คัดลอกซอร์สโค้ดที่เหลือ
COPY . .

# เผยพอร์ต 4000
EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

# รันแอปด้วยสคริปต์ production
CMD ["npm", "start"]