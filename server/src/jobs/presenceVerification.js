import Seat from '../models/Seat.js';
import * as notificationService from '../services/notificationService.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Presence Verification Job — runs every minute.
 * Finds users inactive for > PRESENCE_CHECK_INTERVAL_HOURS
 * and sends "Still Here?" notifications.
 */
const presenceVerification = async (_io) => {
  try {
    const thresholdMs = env.PRESENCE_CHECK_INTERVAL_HOURS * 60 * 60 * 1000;
    const cutoff = new Date(Date.now() - thresholdMs);

    const staleSeats = await Seat.find({
      status: 'occupied',
      lastPresenceConfirmation: { $lt: cutoff },
      abandoned: false,
    });

    if (staleSeats.length === 0) return;

    logger.info(`Presence verification: Found ${staleSeats.length} stale seat(s)`);

    for (const seat of staleSeats) {
      if (!seat.occupiedBy) continue;

      await notificationService.createNotification(
        seat.occupiedBy,
        'Still Here? 🤔',
        `Please confirm you are still using seat ${seat.seatNumber}. If you don't respond within ${env.PRESENCE_GRACE_MINUTES} minutes, your seat will be released.`,
        'presence_check'
      );

      logger.info(`Presence check sent for seat ${seat.seatNumber} (user: ${seat.occupiedBy})`);
    }
  } catch (error) {
    logger.error(`Presence verification job error: ${error.message}`);
  }
};

export default presenceVerification;
