const express = require("express");
const router = express.Router();

// Temporary product database
let products = [];

// Get all products
router.get("/", (req, res) => {
  res.json({
    count: products.length,
    products,
  });
});

// Add new product
router.post("/add", (req, res) => {
  const { name, price, image, category, stock } = req.body;

  if (!name || !price)
    return res.status(400).json({ message: "Name and price required" });

  const product = {
    id: Date.now(),
    name,
    price,
    image: image || "",
    category: category || "General",
    stock: stock || 10,
  };

  products.push(product);

  res.json({
    message: "Product added",
    product,
  });
});

module.exports = router;
