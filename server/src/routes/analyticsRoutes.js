import { Router } from 'express';
import {
  getSummary,
  getHeatmap,
  getPeakHours,
  getPopularZones,
  getUtilization,
} from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(authorize('librarian', 'admin'));

router.get('/summary', getSummary);
router.get('/heatmap', getHeatmap);
router.get('/peak-hours', getPeakHours);
router.get('/popular-zones', getPopularZones);
router.get('/utilization', getUtilization);

export default router;
