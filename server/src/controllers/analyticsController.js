import * as analyticsService from '../services/analyticsService.js';

/**
 * GET /api/analytics/summary
 */
export const getSummary = async (req, res, next) => {
  try {
    const summary = await analyticsService.getSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/heatmap
 */
export const getHeatmap = async (req, res, next) => {
  try {
    const heatmap = await analyticsService.getHeatmap();
    res.json({ success: true, data: heatmap });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/peak-hours
 */
export const getPeakHours = async (req, res, next) => {
  try {
    const peakHours = await analyticsService.getPeakHours();
    res.json({ success: true, data: peakHours });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/popular-zones
 */
export const getPopularZones = async (req, res, next) => {
  try {
    const zones = await analyticsService.getPopularZones();
    res.json({ success: true, data: zones });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/utilization
 */
export const getUtilization = async (req, res, next) => {
  try {
    const utilization = await analyticsService.getUtilization();
    res.json({ success: true, data: utilization });
  } catch (error) {
    next(error);
  }
};
