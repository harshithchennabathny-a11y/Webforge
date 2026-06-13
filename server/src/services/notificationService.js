import Notification from '../models/Notification.js';
import logger from '../utils/logger.js';

// Socket.IO instance — set by server.js after initialization
let io = null;

/**
 * Set the Socket.IO instance (called once from server.js).
 */
export const setSocketIO = (socketIO) => {
  io = socketIO;
};

/**
 * Create a notification and emit via Socket.IO.
 */
export const createNotification = async (userId, title, message, type) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
  });

  // Emit to the user's personal room
  if (io) {
    io.to(`user:${userId}`).emit('notification_created', {
      _id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: notification.createdAt,
    });
  }

  logger.info(`Notification created: "${title}" for user ${userId}`);
  return notification;
};

/**
 * Get notifications for a user (sorted by newest first).
 */
export const getNotifications = async (userId, limit = 50) => {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  return notifications;
};

/**
 * Mark a notification as read.
 */
export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }

  notification.read = true;
  await notification.save();

  return notification;
};

/**
 * Get unread notification count for a user.
 */
export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ userId, read: false });
};
