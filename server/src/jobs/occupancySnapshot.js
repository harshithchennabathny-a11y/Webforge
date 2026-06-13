import Seat from '../models/Seat.js';
import OccupancyHistory from '../models/OccupancyHistory.js';
import logger from '../utils/logger.js';

/**
 * Occupancy Snapshot Job — runs every 5 minutes.
 * Stores current seat state snapshots for time-travel replay.
 */
const occupancySnapshot = async (_io) => {
  try {
    const seats = await Seat.find({});
    const now = new Date();

    const snapshots = seats.map((seat) => ({
      seatId: seat._id,
      status: seat.status,
      occupiedBy: seat.occupiedBy,
      zone: seat.zone,
      timestamp: now,
    }));

    if (snapshots.length > 0) {
      await OccupancyHistory.insertMany(snapshots);
      logger.info(`Occupancy snapshot: ${snapshots.length} seat states recorded at ${now.toISOString()}`);
    }
  } catch (error) {
    logger.error(`Occupancy snapshot job error: ${error.message}`);
  }
};

export default occupancySnapshot;
