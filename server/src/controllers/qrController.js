import * as seatService from '../services/seatService.js';

/**
 * POST /api/qr/checkin
 * Payload: { seatId: "A12" }
 */
export const qrCheckIn = async (req, res, next) => {
  try {
    const { seatId } = req.body;

    if (!seatId) {
      return res.status(400).json({
        success: false,
        message: 'seatId is required',
      });
    }

    // Find seat by seatNumber (QR encodes the seat number, not the MongoDB _id)
    const seat = await seatService.findBySeatNumber(seatId);
    const updated = await seatService.checkIn(seat._id, req.user._id);

    if (req.app.get('io')) {
      req.app.get('io').to('library').emit('seat_occupied', {
        seatId: updated._id,
        seatNumber: updated.seatNumber,
        user: { name: req.user.name },
        zone: updated.zone,
      });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
