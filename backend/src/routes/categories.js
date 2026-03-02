const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id
       GROUP BY c.id
       ORDER BY c.name`
    );
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

module.exports = router;
