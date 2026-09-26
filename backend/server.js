const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rk_broken_halo';

// 2. Middlewares
app.use(cors({
  origin: '*', // Allow connections from frontend (Local file, Live Server, Vite, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for Antigravity IDE console
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// 3. Health Check Route
app.get('/api/health', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    success: true,
    message: 'RK Broken Halo Backend is running!',
    timestamp: new Date().toISOString(),
    database: isMongoConnected ? 'connected' : 'disconnected'
  });
});

// 4. API Routes
const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/projects');

app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);

// 5. Root Route (Friendly Welcome)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'RK Broken Halo API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: 'GET /api/health',
      projects: 'GET /api/projects',
      singleProject: 'GET /api/projects/:id',
      contact: 'POST /api/contact'
    }
  });
});

// 6. 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`
  });
});

// 7. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 8. Connect to MongoDB and Start Server
const startServer = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout fast if local Mongo is not running
    });
    console.log(`⚡ MongoDB Connected Successfully! [DB: ${mongoose.connection.name}]`);
  } catch (err) {
    console.warn('⚠️ MongoDB connection could not be established:', err.message);
    console.warn('💡 The server is running in resilient mode. Set your MONGODB_URI in backend/.env to connect to MongoDB Atlas.');
  }

  app.listen(PORT, () => {
    console.log('══════════════════════════════════════════════════════════');
    console.log(`🎬 RK BROKEN HALO BACKEND SERVER STARTED`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📂 Projects API: http://localhost:${PORT}/api/projects`);
    console.log(`📩 Contact API:  http://localhost:${PORT}/api/contact`);
    console.log('══════════════════════════════════════════════════════════');
  });
};

startServer();

module.exports = app;
