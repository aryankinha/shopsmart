const express = require('express');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

const app = express();

// Middleware
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Products Route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid product id',
    });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: created,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create product',
    });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update product',
    });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: deleted,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
});

const clientDistPath = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Serve SPA routes from the built frontend (excluding API routes)
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Keep a simple root response when frontend is not built yet
  app.get('/', (req, res) => {
    res.send('ShopSmart Backend Service');
  });
}

module.exports = app;
