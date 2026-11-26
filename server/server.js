const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const courseRoutes = require('./routes/courseRoutes.js');
const quizRoutes = require('./routes/quizRoutes.js');
const progressRoutes = require('./routes/progressRoutes.js');
const certificateRoutes = require('./routes/certificateRoutes.js');
const achievementRoutes = require('./routes/achievementRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');

dotenv.config();

const app = express();

const allowedOrigins = new Set(['https://edu-fanor-client.vercel.app']);

function isLocalhostOrigin(origin) {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1');
  } catch {
    return false;
  }
}

function isAllowedOrigin(origin) {
  return !origin || allowedOrigins.has(origin) || isLocalhostOrigin(origin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: '12mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '7d' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('EduFanor API is running...');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status =
    Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
  res.status(status).json({ message: status === 500 ? 'Internal server error' : err.message });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
