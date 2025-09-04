const Database = require('better-sqlite3');
const path = require('path');

const dbFile = process.env.DB_FILE || path.join(__dirname, 'data.sqlite');
const db = new Database(dbFile);

// Enforce foreign keys
db.pragma('foreign_keys = ON');

// Create tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,                          -- รหัสเฉพาะของแต่ละลิงก์ (PK)
  originalUrl TEXT NOT NULL,                    -- ลิงก์ต้นฉบับ
  shortCode TEXT NOT NULL UNIQUE,               -- รหัสย่อ/ชื่อที่ผู้ใช้ตั้งเอง
  createdAt TEXT NOT NULL,                      -- วันที่สร้าง
  expiresAt TEXT,                               -- วันหมดอายุ (NULL = ไม่หมดอายุ)
  clickCount INTEGER NOT NULL DEFAULT 0,        -- จำนวนคลิก
  isActive INTEGER NOT NULL DEFAULT 1,          -- สถานะการใช้งาน (1=active,0=inactive)
  ownerId INTEGER NOT NULL,                     -- เจ้าของลิงก์
  FOREIGN KEY(ownerId) REFERENCES users(id) ON DELETE CASCADE
);
`);

module.exports = db;