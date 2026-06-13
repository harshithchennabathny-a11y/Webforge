import { Router } from 'express';
import {
  getAllSeats,
  getSeatById,
  checkIn,
  startAway,
  returnFromAway,
  checkOut,
  confirmPresence,
} from '../controllers/seatController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All seat routes require authentication
router.use(authenticate);

router.get('/', getAllSeats);
router.get('/:id', getSeatById);
router.post('/:id/checkin', authorize('student'), checkIn);
router.post('/:id/away', authorize('student'), startAway);
router.post('/:id/return', authorize('student'), returnFromAway);
router.post('/:id/checkout', authorize('student'), checkOut);
router.post('/confirm-presence', authorize('student'), confirmPresence);

export default router;
