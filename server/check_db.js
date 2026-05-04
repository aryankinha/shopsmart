require('dotenv').config();
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
  category: String,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
});

const Product = mongoose.model('Product', productSchema);

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI not found');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected!');
    
    const count = await Product.countDocuments();
    console.log('\nTotal Products: ' + count);
    
    const products = await Product.find().sort({ createdAt: -1 });
    
    if (products.length === 0) {
      console.log('No products found.');
    } else {
      console.log('\nProducts:');
      products.forEach((p, idx) => {
        console.log('\n' + (idx + 1) + '. ' + p.name);
        console.log('   Price: $' + p.price);
        console.log('   Category: ' + p.category);
        console.log('   Stock: ' + p.stock);
        console.log('   Description: ' + p.description);
      });
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
