import OccupancyHistory from '../models/OccupancyHistory.js';

/**
 * GET /api/history?start=2026-01-01&end=2026-01-02
 * Returns seat state history for time-travel replay.
 */
export const getHistory = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Both start and end query parameters are required',
      });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use ISO 8601 (e.g. 2026-01-01)',
      });
    }

    // Cap range to 7 days to prevent excessive queries
    const maxRange = 7 * 24 * 60 * 60 * 1000;
    if (endDate - startDate > maxRange) {
      return res.status(400).json({
        success: false,
        message: 'Date range cannot exceed 7 days',
      });
    }

    const history = await OccupancyHistory.find({
      timestamp: { $gte: startDate, $lte: endDate },
    })
      .sort({ timestamp: 1 })
      .populate('seatId', 'seatNumber zone floor')
      .populate('occupiedBy', 'name email')
      .limit(10000);

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};
