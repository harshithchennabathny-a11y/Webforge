import { Router } from 'express';
import {
  getOverview,
  getAbandonedSeats,
  resetSeat,
  getLogs,
  getUsers,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(authorize('librarian', 'admin'));

router.get('/overview', getOverview);
router.get('/abandoned-seats', getAbandonedSeats);
router.post('/reset-seat/:id', resetSeat);
router.get('/logs', getLogs);
router.get('/users', getUsers);

export default router;
