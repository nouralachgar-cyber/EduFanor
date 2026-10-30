const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required', code: 'NO_TOKEN' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Account not found', code: 'ACCOUNT_NOT_FOUND' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended', code: 'ACCOUNT_SUSPENDED' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired or invalid', code: 'INVALID_TOKEN' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Administrator access required', code: 'ADMIN_ONLY' });
  }
  return next();
};

module.exports = { protect, adminOnly };
