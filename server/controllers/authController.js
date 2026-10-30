const User = require('../models/User');
const AdminAuditLog = require('../models/AdminAuditLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const LEGACY_ADMIN_EMAIL = 'noura@edufanor.com';
const adminAttempts = new Map();

const getAdminEmail = () => (process.env.ADMIN_EMAIL || LEGACY_ADMIN_EMAIL).trim().toLowerCase();

// توليد JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt,
});

const isRateLimited = (key) => {
  const now = Date.now();
  const record = adminAttempts.get(key);
  if (!record) return false;
  if (now - record.startedAt > 15 * 60 * 1000) {
    adminAttempts.delete(key);
    return false;
  }
  return record.count >= 8;
};

const recordFailedAttempt = (key) => {
  const now = Date.now();
  const record = adminAttempts.get(key);
  if (!record || now - record.startedAt > 15 * 60 * 1000) {
    adminAttempts.set(key, { count: 1, startedAt: now });
    return;
  }
  record.count += 1;
};

// @desc    تسجيل مستخدم جديد
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'المرجو إدخال جميع المعلومات المطلوبة' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (cleanEmail === getAdminEmail()) {
      return res.status(403).json({
        message: 'This email address is reserved for the platform administrator.',
        code: 'RESERVED_EMAIL',
      });
    }

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'هذا البريد الإلكتروني مستخدم بالفعل' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: String(name).trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'student',
      status: 'active',
    });

    if (user) {
      res.status(201).json({
        ...publicUser(user),
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'بيانات المستخدم غير صالحة' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم: ' + error.message });
  }
};

// @desc    تسجيل الدخول
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'المرجو إدخال البريد الإلكتروني وكلمة المرور' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.status === 'suspended') {
        return res.status(403).json({ message: 'هذا الحساب موقوف. تواصل مع إدارة المنصة.', code: 'ACCOUNT_SUSPENDED' });
      }

      user.lastLoginAt = new Date();
      await user.save();

      res.json({
        ...publicUser(user),
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', code: 'INVALID_CREDENTIALS' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم: ' + error.message });
  }
};

// @desc    Admin login with a one-time bootstrap for the legacy administrator identity
// @route   POST /api/auth/admin-login
// @access  Public (email restricted, role enforced server-side)
const adminLogin = async (req, res) => {
  const key = `${req.ip || 'unknown'}:${String(req.body?.email || '').trim().toLowerCase()}`;

  try {
    if (isRateLimited(key)) {
      return res.status(429).json({ message: 'Too many attempts. Try again in 15 minutes.', code: 'RATE_LIMITED' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required', code: 'MISSING_FIELDS' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const adminEmail = getAdminEmail();
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      if (user.role !== 'admin') {
        recordFailedAttempt(key);
        return res.status(403).json({ message: 'This account is not an administrator', code: 'NOT_ADMIN' });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({ message: 'This administrator account is suspended', code: 'ACCOUNT_SUSPENDED' });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        recordFailedAttempt(key);
        return res.status(401).json({ message: 'Incorrect administrator credentials', code: 'INVALID_CREDENTIALS' });
      }
    } else {
      if (cleanEmail !== adminEmail) {
        recordFailedAttempt(key);
        return res.status(403).json({ message: 'This account is not an administrator', code: 'NO_ACCOUNT' });
      }

      const existingAdmin = await User.exists({ role: 'admin' });
      if (existingAdmin) {
        recordFailedAttempt(key);
        return res.status(403).json({
          message: 'An administrator account already exists. Use its registered email to sign in.',
          code: 'ADMIN_EXISTS',
        });
      }

      if (String(password).length < 8) {
        return res.status(400).json({
          message: 'Choose an administrator password with at least 8 characters.',
          code: 'WEAK_PASSWORD',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        name: 'Noura (Admin)',
        email: cleanEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      });

      await AdminAuditLog.create({
        actor: user._id,
        action: 'admin.bootstrap',
        targetType: 'admin',
        targetId: String(user._id),
        targetLabel: user.email,
        details: 'Legacy administrator identity upgraded to a server-authenticated account.',
      });
    }

    user.lastLoginAt = new Date();
    await user.save();
    adminAttempts.delete(key);

    return res.json({
      ...publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getMe = async (req, res) => {
  return res.json({ user: publicUser(req.user) });
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
};
