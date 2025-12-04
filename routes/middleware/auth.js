const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token)
    return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    // Remove Bearer prefix if present
    const pureToken = token.replace("Bearer ", "");

    const verified = jwt.verify(pureToken, process.env.JWT_SECRET || "secret123");

    req.user = verified; // add decoded user data
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
