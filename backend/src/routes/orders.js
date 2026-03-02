const express = require('express');
const router  = express.Router();
const db      = require('../db');
const { authenticate } = require('../middleware/auth');

// GET /api/orders  — get current user's orders (requires auth)
router.get('/', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT o.*, json_agg(
         json_build_object(
           'product_id',  oi.product_id,
           'product_name',p.name,
           'quantity',    oi.quantity,
           'unit_price',  oi.unit_price
         )
       ) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products    p  ON p.id = oi.product_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, orders: rows });
  } catch (err) {
    console.error('GET /orders error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// POST /api/orders  — place a new order (requires auth)
router.post('/', authenticate, async (req, res) => {
  const { items } = req.body; // [{product_id, quantity}]
  if (!items || !items.length)
    return res.status(400).json({ success: false, error: 'Order must contain at least one item' });

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    let total = 0;
    const enriched = [];

    for (const item of items) {
      const { rows } = await client.query(
        'SELECT id, price, stock FROM products WHERE id = $1 FOR UPDATE',
        [item.product_id]
      );
      if (!rows.length) throw new Error(`Product ${item.product_id} not found`);
      if (rows[0].stock < item.quantity) throw new Error(`Insufficient stock for ${item.product_id}`);

      total += rows[0].price * item.quantity;
      enriched.push({ ...item, unit_price: rows[0].price });

      // Decrement stock
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    const { rows: [order] } = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *',
      [req.user.id, total.toFixed(2)]
    );

    for (const item of enriched) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.unit_price]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, order: { ...order, items: enriched } });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /orders error:', err.message);
    res.status(400).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
