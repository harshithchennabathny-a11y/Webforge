import * as predictionService from '../services/predictionService.js';
import logger from '../utils/logger.js';

/**
 * Prediction Generator Job — runs nightly at 3 AM.
 * Generates tomorrow's hourly occupancy forecast using
 * 7-day moving average from OccupancyHistory.
 */
const predictionGenerator = async (_io) => {
  try {
    const predictions = await predictionService.generatePredictions();
    logger.info(`Prediction generator completed: ${predictions.length} hourly forecasts`);
  } catch (error) {
    logger.error(`Prediction generator job error: ${error.message}`);
  }
};

export default predictionGenerator;
