import Seat from '../models/Seat.js';
import Notification from '../models/Notification.js';
import * as seatService from '../services/seatService.js';
import ActivityLog from '../models/ActivityLog.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Auto-Abandon Job — runs every minute.
 * If a presence_check notification was sent and the user hasn't confirmed
 * within PRESENCE_GRACE_MINUTES, mark the seat as abandoned and release it.
 */
const autoAbandon = async (io) => {
  try {
    const graceMs = env.PRESENCE_GRACE_MINUTES * 60 * 1000;
    const graceCutoff = new Date(Date.now() - graceMs);

    // Find unanswered presence check notifications older than grace period
    const unansweredChecks = await Notification.find({
      type: 'presence_check',
      read: false,
      createdAt: { $lt: graceCutoff },
    });

    if (unansweredChecks.length === 0) return;

    // Get unique user IDs from unanswered checks
    const userIds = [...new Set(unansweredChecks.map((n) => n.userId.toString()))];

    logger.info(`Auto-abandon: ${userIds.length} user(s) with unanswered presence checks`);

    for (const userId of userIds) {
      // Find their occupied seat
      const seat = await Seat.findOne({
        occupiedBy: userId,
        status: 'occupied',
        abandoned: false,
      });

      if (!seat) continue;

      // Mark as abandoned
      seat.status = 'abandoned';
      seat.abandoned = true;
      await seat.save();

      await ActivityLog.create({
        seatId: seat._id,
        userId,
        action: 'abandoned',
        metadata: { seatNumber: seat.seatNumber, reason: 'presence_check_unanswered' },
      });

      if (io) {
        io.to('library').emit('seat_abandoned', {
          seatId: seat._id,
          seatNumber: seat.seatNumber,
        });
      }

      // Then release the seat
      await seatService.releaseSeat(seat._id, 'auto_release');

      if (io) {
        io.to('library').emit('seat_released', {
          seatId: seat._id,
          seatNumber: seat.seatNumber,
          reason: 'auto_abandon',
        });

        io.to(`user:${userId}`).emit('notification_created', {
          title: 'Seat Released',
          message: `Your seat ${seat.seatNumber} has been released due to inactivity.`,
          type: 'seat_released',
        });
      }

      logger.info(`Auto-abandoned and released seat ${seat.seatNumber} (user: ${userId})`);
    }
  } catch (error) {
    logger.error(`Auto-abandon job error: ${error.message}`);
  }
};

export default autoAbandon;
