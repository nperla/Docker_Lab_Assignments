const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const router   = express.Router();
const db       = require('../db');

const JWT_SECRET  = process.env.JWT_SECRET || 'changeme-in-production';
const JWT_EXPIRES = '24h';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: 'name, email and password are required' });

    if (password.length < 8)
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });

    const exists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length)
      return res.status(409).json({ success: false, error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at',
      [name, email, hashed]
    );

    const token = jwt.sign({ id: rows[0].id, role: rows[0].role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ success: true, token, user: rows[0] });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'email and password are required' });

    const { rows } = await db.query(
      'SELECT id, name, email, password, role FROM users WHERE email = $1',
      [email]
    );
    if (!rows.length)
      return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid)
      return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const { password: _, ...user } = rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ success: true, token, user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

module.exports = router;
