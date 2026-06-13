import Seat from '../models/Seat.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import * as seatService from '../services/seatService.js';
import * as analyticsService from '../services/analyticsService.js';

/**
 * GET /api/admin/overview
 * Librarian dashboard overview.
 */
export const getOverview = async (req, res, next) => {
  try {
    const summary = await analyticsService.getSummary();
    const utilization = await analyticsService.getUtilization();

    // Recent activity count (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentActivityCount = await ActivityLog.countDocuments({
      timestamp: { $gte: oneHourAgo },
    });

    res.json({
      success: true,
      data: {
        ...summary,
        utilization,
        recentActivityCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/abandoned-seats
 */
export const getAbandonedSeats = async (req, res, next) => {
  try {
    const seats = await Seat.find({ status: 'abandoned' })
      .populate('occupiedBy', 'name email')
      .sort({ checkInTime: 1 });

    res.json({ success: true, data: seats });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/reset-seat/:id
 * Force release a seat.
 */
export const resetSeat = async (req, res, next) => {
  try {
    const seat = await seatService.releaseSeat(req.params.id, 'admin_reset');

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: 'Seat not found',
      });
    }

    if (req.app.get('io')) {
      req.app.get('io').to('library').emit('seat_released', {
        seatId: seat._id,
        seatNumber: seat.seatNumber,
        resetBy: 'librarian',
      });
    }

    res.json({ success: true, data: seat });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/logs
 * Activity logs with pagination.
 */
export const getLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.action) query.action = req.query.action;
    if (req.query.seatId) query.seatId = req.query.seatId;

    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('seatId', 'seatNumber zone floor')
      .populate('userId', 'name email role');

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 * User management.
 */
export const getUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.role) query.role = req.query.role;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
