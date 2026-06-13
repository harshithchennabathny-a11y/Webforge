import ActivityLog from '../models/ActivityLog.js';
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
 * Log an activity and emit via Socket.IO.
 */
export const logActivity = async (seatId, userId, action, metadata = {}) => {
  const log = await ActivityLog.create({
    seatId,
    userId,
    action,
    metadata,
  });

  // Populate for the event payload
  const populated = await ActivityLog.findById(log._id)
    .populate('seatId', 'seatNumber zone floor')
    .populate('userId', 'name email');

  if (io) {
    io.to('library').emit('activity_created', {
      _id: populated._id,
      seat: populated.seatId,
      user: populated.userId,
      action: populated.action,
      metadata: populated.metadata,
      timestamp: populated.timestamp,
    });
  }

  return log;
};

/**
 * Get recent activity (latest events with pagination).
 */
export const getRecentActivity = async (limit = 30, page = 1) => {
  const skip = (page - 1) * limit;

  const logs = await ActivityLog.find({})
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('seatId', 'seatNumber zone floor')
    .populate('userId', 'name email');

  const total = await ActivityLog.countDocuments();

  return {
    logs,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};
