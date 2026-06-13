import { Router } from 'express';
import { getReplay } from '../controllers/replayController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getReplay);

export default router;
