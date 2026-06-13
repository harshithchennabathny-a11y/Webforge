import * as seatService from '../services/seatService.js';

/**
 * GET /api/seats
 */
export const getAllSeats = async (req, res, next) => {
  try {
    const seats = await seatService.getAllSeats(req.query);
    res.json({ success: true, data: seats });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/seats/:id
 */
export const getSeatById = async (req, res, next) => {
  try {
    const seat = await seatService.getSeatById(req.params.id);
    res.json({ success: true, data: seat });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/seats/:id/checkin
 */
export const checkIn = async (req, res, next) => {
  try {
    const seat = await seatService.checkIn(req.params.id, req.user._id);

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').to('library').emit('seat_occupied', {
        seatId: seat._id,
        seatNumber: seat.seatNumber,
        user: { name: req.user.name },
        zone: seat.zone,
      });
    }

    res.json({ success: true, data: seat });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/seats/:id/away
 */
export const startAway = async (req, res, next) => {
  try {
    const seat = await seatService.startAway(req.params.id, req.user._id);

    if (req.app.get('io')) {
      req.app.get('io').to('library').emit('seat_away', {
        seatId: seat._id,
        seatNumber: seat.seatNumber,
        awayUntil: seat.awayUntil,
      });
    }

    res.json({ success: true, data: seat });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/seats/:id/return
 */
export const returnFromAway = async (req, res, next) => {
  try {
    const seat = await seatService.returnFromAway(req.params.id, req.user._id);

    if (req.app.get('io')) {
      req.app.get('io').to('library').emit('seat_returned', {
        seatId: seat._id,
        seatNumber: seat.seatNumber,
      });
    }

    res.json({ success: true, data: seat });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/seats/:id/checkout
 */
export const checkOut = async (req, res, next) => {
  try {
    const seat = await seatService.checkOut(req.params.id, req.user._id);

    if (req.app.get('io')) {
      req.app.get('io').to('library').emit('seat_released', {
        seatId: seat._id,
        seatNumber: seat.seatNumber,
      });
    }

    res.json({ success: true, data: seat });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/seats/confirm-presence
 */
export const confirmPresence = async (req, res, next) => {
  try {
    const seat = await seatService.confirmPresence(req.user._id);
    res.json({ success: true, data: seat });
  } catch (error) {
    next(error);
  }
};
