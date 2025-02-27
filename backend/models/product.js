const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // ...existing code...
  sizes: [
    {
      size: String,
      price: Number
    }
  ]
  // ...existing code...
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
