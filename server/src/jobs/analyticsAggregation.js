import * as analyticsService from '../services/analyticsService.js';
import logger from '../utils/logger.js';

/**
 * Analytics Aggregation Job — runs nightly at 2 AM.
 * Computes daily analytics snapshot with peak hours, occupancy rates,
 * zone popularity, and average session duration.
 */
const analyticsAggregation = async (io) => {
  try {
    const snapshot = await analyticsService.aggregateNightly();

    if (io) {
      io.to('library').emit('analytics_updated', {
        date: snapshot.date,
        occupancyRate: snapshot.occupancyRate,
        peakHour: snapshot.peakHour,
        mostPopularZone: snapshot.mostPopularZone,
      });
    }

    logger.info('Nightly analytics aggregation completed');
  } catch (error) {
    logger.error(`Analytics aggregation job error: ${error.message}`);
  }
};

export default analyticsAggregation;
