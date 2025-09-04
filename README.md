# URL Shortener (React + Tailwind + Express + SQLite + Docker)

ระบบย่อลิงก์ที่ตั้งชื่อเองได้ พร้อม Register/Login และแดชบอร์ดจัดการลิงก์
- ฟิลด์ลิงก์: id (PK), originalUrl, shortCode (unique), createdAt, expiresAt, clickCount, isActive, ownerId
- Frontend: React + Vite + Tailwind
- Backend: Express + better-sqlite3 (SQLite), JWT auth, bcrypt
- Docker: Nginx serve frontend + proxy /api ไป backend

## โครงสร้าง
- client: React UI
- server: Express API + SQLite
- docker-compose + Nginx config (nginx.conf)

## Development (ไม่ใช้ Docker)
1. Server
   - คัดลอก server/.env.example ไปเป็น server/.env แล้วแก้ค่าให้เหมาะสม
   - ติดตั้งและรัน
     - `npm install` (ในโฟลเดอร์ server)
     - `npm run dev` (port 4000)
2. Client
   - คัดลอก client/.env.example ไปเป็น client/.env
   - ติดตั้งและรัน
     - `npm install` (ในโฟลเดอร์ client)
     - `npm run dev` (port 5173)

เปิด http://localhost:5173

## Production ด้วย Docker
- ใช้ docker-compose สร้าง 2 services: api (port 4000), web (Nginx, port 8080)
- ไฟล์ DB อยู่ใน volume `sqlite_data` ที่ mount ไป /app/data (ตัวแปร DB_FILE=/app/data/data.sqlite)

คำสั่งหลัก:
- `docker compose up -d --build`
- เปิด UI ที่ http://localhost:8080
- Short link ใช้ http://localhost:4000/{shortCode}

## หมายเหตุ
- อย่า commit ไฟล์ .env และ server/data.sqlite (ถูก ignore แล้วใน .gitignore)
- ถ้าใช้ Windows แล้วพอร์ต 4000 ถูกใช้งาน ให้แก้ host port ใน docker-compose เป็น "4001:4000"