import * as predictionService from '../services/predictionService.js';

/**
 * GET /api/predictions
 */
export const getPredictions = async (req, res, next) => {
  try {
    const predictions = await predictionService.getPredictions(req.query.date);
    res.json({ success: true, data: predictions });
  } catch (error) {
    next(error);
  }
};
