import { Router } from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('student'), getRecommendations);

export default router;
