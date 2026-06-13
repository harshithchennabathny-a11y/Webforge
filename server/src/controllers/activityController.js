import * as activityService from '../services/activityService.js';

/**
 * GET /api/activity
 */
export const getActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 30;
    const page = parseInt(req.query.page, 10) || 1;
    const result = await activityService.getRecentActivity(limit, page);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
