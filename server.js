
// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic security headers (optional but good)
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Retrozz');
  next();
});

// --- Database connect ---
const MONGO_URI = process.env.MONGO_URI || '';
if (!MONGO_URI) {
  console.warn('⚠️  No MONGO_URI provided. The app will still run but DB features will fail.');
}

const connectDB = async () => {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI, {
        // useNewUrlParser/useUnifiedTopology not required in latest mongoose
      });
      console.log('✅ MongoDB connected');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
  }
};
connectDB();

// --- Simple health route ---
app.get('/', (req, res) => {
  res.json({ ok: true, app: 'Retrozz Backend', env: process.env.NODE_ENV || 'development' });
});

// --- Mount API routes (we will create these files next) ---
/*
  Expected route files (we'll create these next):
  - ./routes/auth.js       => /api/auth
  - ./routes/products.js   => /api/products
  - ./routes/cart.js       => /api/cart
  - ./routes/orders.js     => /api/orders
*/
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
// If you add cart/orders files later, mount them similarly:
// app.use('/api/cart', require('./routes/cart'));
// app.use('/api/orders', require('./routes/orders'));

// --- Static serve (optional for assets) ---
app.use('/static', express.static(path.join(__dirname, 'public')));

// --- 404 handler ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack || err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Retrozz backend running on port ${PORT}`);
});
