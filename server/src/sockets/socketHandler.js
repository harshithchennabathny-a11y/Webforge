import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Initialize Socket.IO with JWT authentication and room management.
 */
const initializeSocket = (io) => {
  // JWT authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (user: ${socket.userId})`);

    // Join personal room for targeted notifications
    socket.join(`user:${socket.userId}`);

    // Join global library room for broadcast events
    socket.join('library');

    // Handle room joining for specific floors/zones
    socket.on('join_floor', (floor) => {
      socket.join(`floor:${floor}`);
      logger.debug(`Socket ${socket.id} joined floor:${floor}`);
    });

    socket.on('join_zone', (zone) => {
      socket.join(`zone:${zone}`);
      logger.debug(`Socket ${socket.id} joined zone:${zone}`);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error: ${socket.id} — ${error.message}`);
    });
  });

  logger.info('Socket.IO initialized with JWT authentication');
  return io;
};

export default initializeSocket;
