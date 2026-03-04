const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const products = [
  { id: 1, name: "Laptop Pro",    price: 1299.99, category: "Electronics", stock: 15 },
  { id: 2, name: "Coffee Mug",    price: 12.99,   category: "Kitchen",     stock: 200 },
  { id: 3, name: "Running Shoes", price: 89.99,   category: "Sports",      stock: 50 },
  { id: 4, name: "Docker Book",   price: 34.99,   category: "Books",       stock: 75 },
  { id: 5, name: "Desk Lamp",     price: 29.99,   category: "Home",        stock: 30 }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Get all products (with optional category filter)
app.get('/products', (req, res) => {
  const { category } = req.query;
  const result = category
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products;
  res.json({ count: result.length, products: result });
});

// Get product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.get('/', (req, res) => {
  res.json({
    message: 'Products API — Running in Docker!',
    endpoints: [
      'GET /health',
      'GET /products',
      'GET /products?category=Electronics',
      'GET /products/:id'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Products API running on port ${PORT}`);
});
