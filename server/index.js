require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authMiddleware = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const linksRoutes = require('./routes/links');

const app = express();

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Auth routes
app.use('/api/auth', authRoutes);

// Link routes (protected)
app.use('/api/links', authMiddleware, linksRoutes);

// Public redirect route (must be last)
app.get('/:code', (req, res) => {
  const { code } = req.params;

  const link = db.prepare('SELECT * FROM links WHERE shortCode = ?').get(code);
  if (!link) {
    return res.status(404).send('Not found');
  }

  // Check active and expiry
  const now = new Date();
  if (!link.isActive) {
    return res.status(410).send('Link is inactive');
  }
  if (link.expiresAt) {
    const exp = new Date(link.expiresAt);
    if (!isNaN(exp.getTime()) && now > exp) {
      return res.status(410).send('Link has expired');
    }
  }

  // Increase click count
  db.prepare('UPDATE links SET clickCount = clickCount + 1 WHERE id = ?').run(link.id);

  // Redirect
  return res.redirect(link.originalUrl);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});