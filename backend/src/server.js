require('dotenv').config();
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const db         = require('./db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting — 100 requests per 15 minutes per IP
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
}));

// ── Health Endpoint ──────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await db.testConnection();
    res.json({
      status:    'ok',
      database:  'connected',
      timestamp: new Date().toISOString(),
      uptime:    Math.floor(process.uptime()),
      version:   process.env.npm_package_version || '1.0.0',
    });
  } catch (err) {
    res.status(503).json({
      status:   'degraded',
      database: 'disconnected',
      error:    err.message,
    });
  }
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders',     require('./routes/orders'));

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShopWave API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app; // exported for tests
