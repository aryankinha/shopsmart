const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample products data
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://via.placeholder.com/200?text=Headphones',
    inStock: true
  },
  {
    id: 2,
    name: 'USB-C Cable',
    price: 12.99,
    description: 'Fast charging USB-C cable for all devices',
    image: 'https://via.placeholder.com/200?text=Cable',
    inStock: true
  },
  {
    id: 3,
    name: 'Phone Case',
    price: 24.99,
    description: 'Durable and stylish phone protective case',
    image: 'https://via.placeholder.com/200?text=Phone+Case',
    inStock: true
  },
  {
    id: 4,
    name: 'Screen Protector',
    price: 9.99,
    description: 'Tempered glass screen protector for phones',
    image: 'https://via.placeholder.com/200?text=Screen+Protector',
    inStock: false
  },
  {
    id: 5,
    name: 'Portable Charger',
    price: 49.99,
    description: '20000mAh portable power bank with fast charging',
    image: 'https://via.placeholder.com/200?text=Charger',
    inStock: true
  },
  {
    id: 6,
    name: 'Bluetooth Speaker',
    price: 59.99,
    description: 'Waterproof portable Bluetooth speaker',
    image: 'https://via.placeholder.com/200?text=Speaker',
    inStock: true
  }
];

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Products Route
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products,
    count: products.length
  });
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json({
      success: true,
      data: product
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
});

// Root Route (optional, just to show something)
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

module.exports = app;
