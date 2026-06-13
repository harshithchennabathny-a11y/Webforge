import Seat from '../models/Seat.js';
import OccupancyHistory from '../models/OccupancyHistory.js';
import ActivityLog from '../models/ActivityLog.js';
import AnalyticsSnapshot from '../models/AnalyticsSnapshot.js';
import logger from '../utils/logger.js';

/**
 * Real-time occupancy summary.
 */
export const getSummary = async () => {
  const seats = await Seat.find({});
  const total = seats.length;
  const available = seats.filter((s) => s.status === 'available').length;
  const occupied = seats.filter((s) => s.status === 'occupied').length;
  const away = seats.filter((s) => s.status === 'away').length;
  const abandoned = seats.filter((s) => s.status === 'abandoned').length;
  const occupancyRate = total > 0 ? Math.round(((occupied + away) / total) * 100) : 0;

  return {
    occupancyRate,
    availableSeats: available,
    occupiedSeats: occupied,
    awaySeats: away,
    abandonedSeats: abandoned,
    totalSeats: total,
  };
};

/**
 * Zone-level heatmap data.
 */
export const getHeatmap = async () => {
  const seats = await Seat.find({});
  const zones = [...new Set(seats.map((s) => s.zone))];

  const heatmap = zones.map((zone) => {
    const zoneSeats = seats.filter((s) => s.zone === zone);
    const total = zoneSeats.length;
    const occupied = zoneSeats.filter((s) => s.status === 'occupied' || s.status === 'away').length;
    const occupancy = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const avgPopularity = total > 0
      ? Math.round(zoneSeats.reduce((sum, s) => sum + s.popularityScore, 0) / total)
      : 0;

    return {
      zone,
      occupancy,
      avgDuration: 0, // will be enriched below
      popularity: avgPopularity,
    };
  });

  // Enrich with avg session duration from activity logs (last 24h)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const checkoutLogs = await ActivityLog.find({
    action: 'check_out',
    timestamp: { $gte: oneDayAgo },
  });

  for (const h of heatmap) {
    const zoneLogs = checkoutLogs.filter((log) => log.metadata?.zone === h.zone || false);
    if (zoneLogs.length > 0) {
      const totalDuration = zoneLogs.reduce(
        (sum, log) => sum + (log.metadata?.sessionDuration || 0),
        0
      );
      h.avgDuration = Math.round(totalDuration / zoneLogs.length);
    }
  }

  return heatmap;
};

/**
 * Peak hours from OccupancyHistory (last 7 days).
 */
export const getPeakHours = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const pipeline = [
    { $match: { timestamp: { $gte: sevenDaysAgo }, status: { $in: ['occupied', 'away'] } } },
    {
      $group: {
        _id: { $hour: '$timestamp' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];

  const results = await OccupancyHistory.aggregate(pipeline);

  // Normalize — each hour entry represents average occupied count
  const totalSeats = await Seat.countDocuments();
  const daysOfData = 7;

  return results.map((r) => ({
    hour: `${r._id}:00`,
    occupancy: Math.min(100, Math.round((r.count / (totalSeats * daysOfData)) * 100)),
  }));
};

/**
 * Popular zones from OccupancyHistory.
 */
export const getPopularZones = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const pipeline = [
    { $match: { timestamp: { $gte: sevenDaysAgo }, status: { $in: ['occupied', 'away'] } } },
    {
      $group: {
        _id: '$zone',
        totalOccupied: { $sum: 1 },
      },
    },
    { $sort: { totalOccupied: -1 } },
  ];

  const results = await OccupancyHistory.aggregate(pipeline);

  return results.map((r) => ({
    zone: r._id,
    usage: r.totalOccupied,
  }));
};

/**
 * Per-zone utilization rates.
 */
export const getUtilization = async () => {
  const seats = await Seat.find({});
  const zones = [...new Set(seats.map((s) => s.zone))];

  return zones.map((zone) => {
    const zoneSeats = seats.filter((s) => s.zone === zone);
    const total = zoneSeats.length;
    const inUse = zoneSeats.filter((s) => s.status !== 'available').length;
    const utilization = total > 0 ? Math.round((inUse / total) * 100) : 0;

    return {
      zone,
      totalSeats: total,
      inUse,
      utilization,
    };
  });
};

/**
 * Nightly analytics aggregation — creates an AnalyticsSnapshot.
 */
export const aggregateNightly = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const summary = await getSummary();
  const peakHours = await getPeakHours();
  const popularZones = await getPopularZones();

  // Find peak hour
  let peakHour = null;
  let maxOccupancy = 0;
  for (const ph of peakHours) {
    if (ph.occupancy > maxOccupancy) {
      maxOccupancy = ph.occupancy;
      peakHour = ph.hour;
    }
  }

  // Most popular zone
  const mostPopularZone = popularZones.length > 0 ? popularZones[0].zone : null;

  // Avg session duration from today's checkouts
  const todayStart = new Date(today);
  const todayEnd = new Date(today);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const checkouts = await ActivityLog.find({
    action: 'check_out',
    timestamp: { $gte: todayStart, $lt: todayEnd },
  });

  let avgSessionDuration = 0;
  if (checkouts.length > 0) {
    const totalDuration = checkouts.reduce(
      (sum, log) => sum + (log.metadata?.sessionDuration || 0),
      0
    );
    avgSessionDuration = Math.round(totalDuration / checkouts.length);
  }

  const snapshot = await AnalyticsSnapshot.findOneAndUpdate(
    { date: today },
    {
      date: today,
      occupancyRate: summary.occupancyRate,
      occupiedSeats: summary.occupiedSeats,
      availableSeats: summary.availableSeats,
      awaySeats: summary.awaySeats,
      abandonedSeats: summary.abandonedSeats,
      peakHour,
      mostPopularZone,
      avgSessionDuration,
    },
    { upsert: true, new: true }
  );

  logger.info(`Analytics snapshot created for ${today.toISOString().split('T')[0]}`);
  return snapshot;
};
