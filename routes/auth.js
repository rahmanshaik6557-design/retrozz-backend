const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Dummy user DB (replace with MongoDB later)
let users = [];

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const newUser = { id: Date.now(), name, email, password: hashed };
  users.push(newUser);

  res.json({ message: "User registered", user: { id: newUser.id, name, email } });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid email" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret123", {
    expiresIn: "7d",
  });

  res.json({ message: "Login successful", token });
});

module.exports = router;
