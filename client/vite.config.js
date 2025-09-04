import { defineConfig } from 'vite';

export default defineConfig({
  // ใช้ base path ตามชื่อรีโป (เช่น /REPO/) ถ้าเป็น User/Org Page ให้ตั้งเป็น '/' ผ่าน VITE_BASE_PATH
  base: process.env.VITE_BASE_PATH || '/',
});