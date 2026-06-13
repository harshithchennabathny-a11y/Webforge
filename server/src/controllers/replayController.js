import OccupancyHistory from '../models/OccupancyHistory.js';

/**
 * GET /api/replay?date=2026-01-01
 * Returns hourly aggregated occupancy for digital twin timeline slider.
 */
export const getReplay = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const pipeline = [
      {
        $match: {
          timestamp: { $gte: targetDate, $lt: nextDay },
          status: { $in: ['occupied', 'away'] },
        },
      },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          occupied: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const results = await OccupancyHistory.aggregate(pipeline);

    const replay = results.map((r) => ({
      timestamp: `${String(r._id).padStart(2, '0')}:00`,
      occupied: r.occupied,
    }));

    res.json({ success: true, data: replay });
  } catch (error) {
    next(error);
  }
};
