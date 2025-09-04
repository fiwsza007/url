const express = require('express');
const db = require('../db');
const { isValidUrl, isValidShortCode } = require('../utils/validators');

const router = express.Router();

// Create link
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { originalUrl, shortCode, expiresAt } = req.body || {};

  // ใช้ dynamic import สำหรับ nanoid (เพราะ nanoid เป็น ESM-only)
  const { customAlphabet } = await import('nanoid');
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16);

  if (!originalUrl) return res.status(400).json({ message: 'originalUrl is required' });
  if (!isValidUrl(originalUrl)) return res.status(400).json({ message: 'Invalid originalUrl' });
  if (!shortCode || !isValidShortCode(shortCode)) {
    return res.status(400).json({ message: 'shortCode is required and must be 3-30 chars [a-zA-Z0-9-_]' });
  }
  const exists = db.prepare('SELECT id FROM links WHERE shortCode = ?').get(shortCode);
  if (exists) return res.status(409).json({ message: 'shortCode already in use' });

  const id = nanoid();
  const createdAt = new Date().toISOString();

  // Optional expiresAt validation
  let exp = null;
  if (expiresAt) {
    const d = new Date(expiresAt);
    if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid expiresAt' });
    exp = d.toISOString();
  }

  db.prepare(`
    INSERT INTO links (id, originalUrl, shortCode, createdAt, expiresAt, clickCount, isActive, ownerId)
    VALUES (?, ?, ?, ?, ?, 0, 1, ?)
  `).run(id, originalUrl, shortCode, createdAt, exp, userId);

  const link = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
  return res.status(201).json(link);
});

// Get all links of logged-in user
router.get('/', (req, res) => {
  const userId = req.user.id;
  const rows = db.prepare(`
    SELECT * FROM links WHERE ownerId = ? ORDER BY datetime(createdAt) DESC
  `).all(userId);
  return res.json(rows);
});

// Update link (isActive, expiresAt)
router.patch('/:id', (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { isActive, expiresAt } = req.body || {};

  const link = db.prepare('SELECT * FROM links WHERE id = ? AND ownerId = ?').get(id, userId);
  if (!link) return res.status(404).json({ message: 'Link not found' });

  let exp = link.expiresAt;
  if (typeof expiresAt !== 'undefined') {
    if (expiresAt === null || expiresAt === '') {
      exp = null;
    } else {
      const d = new Date(expiresAt);
      if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid expiresAt' });
      exp = d.toISOString();
    }
  }

  let active = link.isActive;
  if (typeof isActive !== 'undefined') {
    active = isActive ? 1 : 0;
  }

  db.prepare('UPDATE links SET isActive = ?, expiresAt = ? WHERE id = ?').run(active, exp, id);

  const updated = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
  return res.json(updated);
});

// Delete link
router.delete('/:id', (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const link = db.prepare('SELECT * FROM links WHERE id = ? AND ownerId = ?').get(id, userId);
  if (!link) return res.status(404).json({ message: 'Link not found' });

  db.prepare('DELETE FROM links WHERE id = ?').run(id);
  return res.json({ message: 'Deleted' });
});

module.exports = router;