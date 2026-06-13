import { Router } from 'express';
import { getHistory } from '../controllers/historyController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('librarian', 'admin'), getHistory);

export default router;
