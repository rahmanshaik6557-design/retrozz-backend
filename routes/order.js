const express = require("express");
const router = express.Router();

// Temporary orders database (replace with MongoDB later)
let orders = [];

// Create an order
router.post("/create", (req, res) => {
  const { userId, items, total } = req.body;

  if (!userId || !items || items.length === 0)
    return res.status(400).json({ message: "Order details missing" });

  const order = {
    id: Date.now(),
    userId,
    items,
    total,
    status: "pending",
    date: new Date()
  };

  orders.push(order);

  res.json({
    message: "Order created",
    order
  });
});

// Get user's order history
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const userOrders = orders.filter(o => o.userId == userId);

  res.json({
    count: userOrders.length,
    orders: userOrders
  });
});

module.exports = router;
