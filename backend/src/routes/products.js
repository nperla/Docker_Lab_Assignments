const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/products  — list all products (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;

    let sql = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM   products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE  1=1
    `;
    const params = [];

    if (category) {
      params.push(category);
      sql += ` AND c.slug = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
    }

    params.push(Number(limit), Number(offset));
    sql += ` ORDER BY p.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const { rows } = await db.query(sql, params);
    res.json({ success: true, count: rows.length, products: rows });
  } catch (err) {
    console.error('GET /products error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id  — single product
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT p.*, c.name AS category_name
       FROM   products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE  p.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

module.exports = router;
