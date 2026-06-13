import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';

// Config
import env from './config/env.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import qrRoutes from './routes/qrRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import replayRoutes from './routes/replayRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Socket.IO
import initializeSocket from './sockets/socketHandler.js';

// Services (for Socket.IO injection)
import { setSocketIO as setNotificationSocketIO } from './services/notificationService.js';
import { setSocketIO as setActivitySocketIO } from './services/activityService.js';

// Background Jobs
import awayExpiration from './jobs/awayExpiration.js';
import presenceVerification from './jobs/presenceVerification.js';
import autoAbandon from './jobs/autoAbandon.js';
import occupancySnapshot from './jobs/occupancySnapshot.js';
import analyticsAggregation from './jobs/analyticsAggregation.js';
import predictionGenerator from './jobs/predictionGenerator.js';

// ────────────────────────────────────────────────────────────────
// Express App Setup
// ────────────────────────────────────────────────────────────────

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Store io instance on app for controller access
app.set('io', io);

// Initialize Socket.IO authentication and room management
initializeSocket(io);

// Inject Socket.IO into services
setNotificationSocketIO(io);
setActivitySocketIO(io);

// ────────────────────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────────────────────

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// ────────────────────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/replay', replayRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

// ────────────────────────────────────────────────────────────────
// Background Jobs (node-cron)
// ────────────────────────────────────────────────────────────────

// Every minute: away expiration, presence verification, auto-abandon
cron.schedule('* * * * *', () => {
  awayExpiration(io);
  presenceVerification(io);
  autoAbandon(io);
});

// Every 5 minutes: occupancy snapshot
cron.schedule('*/5 * * * *', () => {
  occupancySnapshot(io);
});

// Nightly at 2 AM: analytics aggregation
cron.schedule('0 2 * * *', () => {
  analyticsAggregation(io);
});

// Nightly at 3 AM: prediction generator
cron.schedule('0 3 * * *', () => {
  predictionGenerator(io);
});

logger.info('Background jobs registered');

// ────────────────────────────────────────────────────────────────
// Start Server
// ────────────────────────────────────────────────────────────────

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server
    server.listen(env.PORT, () => {
      logger.info(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║    🪑  SeatSync Backend Server                   ║
║                                                  ║
║    Port:        ${String(env.PORT).padEnd(33)}║
║    Environment: ${env.NODE_ENV.padEnd(33)}║
║    MongoDB:     Connected                        ║
║    Socket.IO:   Enabled                          ║
║    Cron Jobs:   Running                          ║
║                                                  ║
╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();

export default app;
