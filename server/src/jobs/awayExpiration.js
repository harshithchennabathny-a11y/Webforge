import Seat from '../models/Seat.js';
import * as seatService from '../services/seatService.js';
import logger from '../utils/logger.js';

/**
 * Away Expiration Job — runs every minute.
 * Finds seats where awayUntil has passed and releases them.
 */
const awayExpiration = async (io) => {
  try {
    const now = new Date();

    const expiredSeats = await Seat.find({
      status: 'away',
      awayUntil: { $lt: now },
    });

    if (expiredSeats.length === 0) return;

    logger.info(`Away expiration: Found ${expiredSeats.length} expired seat(s)`);

    for (const seat of expiredSeats) {
      const released = await seatService.releaseSeat(seat._id, 'auto_release');

      if (released && io) {
        io.to('library').emit('seat_released', {
          seatId: released._id,
          seatNumber: released.seatNumber,
          reason: 'away_expired',
        });

        // Notify the user
        if (seat.occupiedBy) {
          io.to(`user:${seat.occupiedBy}`).emit('notification_created', {
            title: 'Seat Released',
            message: `Your seat ${seat.seatNumber} has been released because your away time expired.`,
            type: 'seat_released',
          });
        }
      }
    }
  } catch (error) {
    logger.error(`Away expiration job error: ${error.message}`);
  }
};

export default awayExpiration;
