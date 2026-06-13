import { Router } from 'express';
import { getPredictions } from '../controllers/predictionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getPredictions);

export default router;
