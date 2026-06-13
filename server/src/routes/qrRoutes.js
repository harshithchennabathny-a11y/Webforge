import { Router } from 'express';
import { qrCheckIn } from '../controllers/qrController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/checkin', authenticate, authorize('student'), qrCheckIn);

export default router;
