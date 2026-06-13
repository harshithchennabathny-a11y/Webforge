import OccupancyHistory from '../models/OccupancyHistory.js';
import Prediction from '../models/Prediction.js';
import Seat from '../models/Seat.js';
import logger from '../utils/logger.js';

/**
 * Generate next-day occupancy predictions using 7-day moving average.
 *
 * For each hour (0–23), averages the occupancy from the same hour over
 * the last 7 days of OccupancyHistory snapshots.
 */
export const generatePredictions = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const totalSeats = await Seat.countDocuments();

  if (totalSeats === 0) {
    logger.warn('No seats found — skipping prediction generation');
    return [];
  }

  // Aggregate occupied count by hour across last 7 days
  const pipeline = [
    {
      $match: {
        timestamp: { $gte: sevenDaysAgo },
        status: { $in: ['occupied', 'away'] },
      },
    },
    {
      $group: {
        _id: { $hour: '$timestamp' },
        avgOccupied: { $avg: 1 },
        totalSnapshots: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];

  const hourlyData = await OccupancyHistory.aggregate(pipeline);

  // Count total snapshots per hour for proper averaging
  const snapshotsPerHour = {};
  const occupiedPerHour = {};

  for (const entry of hourlyData) {
    const hour = entry._id;
    occupiedPerHour[hour] = entry.totalSnapshots;
  }

  // For proper averaging: count total snapshots at each hour (across all seats)
  const totalSnapshotsPipeline = [
    { $match: { timestamp: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $hour: '$timestamp' },
        total: { $sum: 1 },
      },
    },
  ];

  const totalSnapshots = await OccupancyHistory.aggregate(totalSnapshotsPipeline);
  for (const entry of totalSnapshots) {
    snapshotsPerHour[entry._id] = entry.total;
  }

  // Generate predictions for each hour
  const predictions = [];
  for (let hour = 0; hour < 24; hour++) {
    const occupied = occupiedPerHour[hour] || 0;
    const total = snapshotsPerHour[hour] || 1;
    const rate = Math.min(100, Math.round((occupied / total) * 100));

    predictions.push({
      date: tomorrow,
      hour,
      predictedOccupancy: rate,
    });
  }

  // Upsert predictions
  for (const pred of predictions) {
    await Prediction.findOneAndUpdate(
      { date: pred.date, hour: pred.hour },
      pred,
      { upsert: true, new: true }
    );
  }

  logger.info(`Predictions generated for ${tomorrow.toISOString().split('T')[0]}: ${predictions.length} hours`);
  return predictions;
};

/**
 * Get predictions for a given date (default: tomorrow).
 */
export const getPredictions = async (date) => {
  const targetDate = date ? new Date(date) : new Date();
  if (!date) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  targetDate.setHours(0, 0, 0, 0);

  const predictions = await Prediction.find({ date: targetDate }).sort({ hour: 1 });

  // Format as { "9AM": 45, "12PM": 78, ... }
  const formatted = {};
  for (const pred of predictions) {
    const h = pred.hour;
    const label = h === 0 ? '12AM' : h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`;
    formatted[label] = pred.predictedOccupancy;
  }

  return formatted;
};
