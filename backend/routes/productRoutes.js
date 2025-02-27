const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// ...existing code...

router.post('/add', async (req, res) => {
  const { name, description, sizes, prices } = req.body;
  const product = new Product({ name, description, sizes, prices });
  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// ...existing code...

module.exports = router;
