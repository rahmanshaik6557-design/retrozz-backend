const express = require("express");
const router = express.Router();

// Temporary cart DB (later replaced with MongoDB)
let cart = [];

// Get user's cart
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const userCart = cart.filter(item => item.userId == userId);

  res.json({
    count: userCart.length,
    cart: userCart
  });
});

// Add to cart
router.post("/add", (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId)
    return res.status(400).json({ message: "userId and productId required" });

  const item = {
    id: Date.now(),
    userId,
    productId,
    quantity: quantity || 1
  };

  cart.push(item);

  res.json({
    message: "Item added to cart",
    item
  });
});

// Remove from cart
router.delete("/remove/:id", (req, res) => {
  const { id } = req.params;

  cart = cart.filter(item => item.id != id);

  res.json({ message: "Item removed" });
});

module.exports = router;
