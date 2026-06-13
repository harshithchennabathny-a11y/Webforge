import * as recommendationService from '../services/recommendationService.js';

/**
 * GET /api/recommendations
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const preferences = {
      charging: req.query.charging === 'true',
      window: req.query.window === 'true',
      quiet: req.query.quiet === 'true',
    };

    const recommendations = await recommendationService.getRecommendations(preferences);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};
