require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const seedProducts = [
  {
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
    imageUrl: 'https://picsum.photos/seed/shopsmart-headphones/400/300',
    category: 'Audio',
    stock: 12,
  },
  {
    name: 'USB-C Cable',
    price: 12.99,
    description: 'Fast charging USB-C cable for all devices',
    imageUrl: 'https://picsum.photos/seed/shopsmart-cable/400/300',
    category: 'Accessories',
    stock: 40,
  },
  {
    name: 'Phone Case',
    price: 24.99,
    description: 'Durable and stylish phone protective case',
    imageUrl: 'https://picsum.photos/seed/shopsmart-phone-case/400/300',
    category: 'Accessories',
    stock: 25,
  },
  {
    name: 'Screen Protector',
    price: 9.99,
    description: 'Tempered glass screen protector for phones',
    imageUrl: 'https://picsum.photos/seed/shopsmart-screen-protector/400/300',
    category: 'Accessories',
    stock: 0,
  },
  {
    name: 'Portable Charger',
    price: 49.99,
    description: '20000mAh portable power bank with fast charging',
    imageUrl: 'https://picsum.photos/seed/shopsmart-charger/400/300',
    category: 'Power',
    stock: 18,
  },
  {
    name: 'Bluetooth Speaker',
    price: 59.99,
    description: 'Waterproof portable Bluetooth speaker',
    imageUrl: 'https://picsum.photos/seed/shopsmart-speaker/400/300',
    category: 'Audio',
    stock: 15,
  },
];

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is missing in environment variables');
    }

    await mongoose.connect(uri);
    await Product.deleteMany({});
    const inserted = await Product.insertMany(seedProducts);

    console.log(`Seeded ${inserted.length} products into MongoDB`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seed();
