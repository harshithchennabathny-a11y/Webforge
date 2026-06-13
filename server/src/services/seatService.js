import Seat from '../models/Seat.js';
import ActivityLog from '../models/ActivityLog.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';

/**
 * Get all seats with optional filters.
 */
export const getAllSeats = async (filters = {}) => {
  const query = {};
  if (filters.floor) query.floor = parseInt(filters.floor, 10);
  if (filters.zone) query.zone = filters.zone;
  if (filters.status) query.status = filters.status;

  const seats = await Seat.find(query)
    .populate('occupiedBy', 'name email role')
    .sort({ seatNumber: 1 });

  return seats;
};

/**
 * Get a single seat by ID.
 */
export const getSeatById = async (seatId) => {
  const seat = await Seat.findById(seatId).populate('occupiedBy', 'name email role');
  if (!seat) {
    const error = new Error('Seat not found');
    error.statusCode = 404;
    throw error;
  }
  return seat;
};

/**
 * Check in a student to a seat.
 */
export const checkIn = async (seatId, userId) => {
  // Check if user already occupies a seat
  const existingSeat = await Seat.findOne({ occupiedBy: userId, status: { $in: ['occupied', 'away'] } });
  if (existingSeat) {
    const error = new Error(`You are already checked into seat ${existingSeat.seatNumber}. Check out first.`);
    error.statusCode = 400;
    throw error;
  }

  const seat = await Seat.findById(seatId);
  if (!seat) {
    const error = new Error('Seat not found');
    error.statusCode = 404;
    throw error;
  }

  if (seat.status !== 'available') {
    const error = new Error('Seat is not available');
    error.statusCode = 400;
    throw error;
  }

  seat.status = 'occupied';
  seat.occupiedBy = userId;
  seat.checkInTime = new Date();
  seat.lastPresenceConfirmation = new Date();
  seat.abandoned = false;
  seat.awayUntil = null;
  seat.popularityScore = Math.min(100, seat.popularityScore + 1);
  await seat.save();

  await ActivityLog.create({
    seatId: seat._id,
    userId,
    action: 'check_in',
    metadata: { seatNumber: seat.seatNumber, zone: seat.zone },
  });

  logger.info(`Check-in: User ${userId} → Seat ${seat.seatNumber}`);

  return seat.populate('occupiedBy', 'name email role');
};

/**
 * Start Away mode (max 20 minutes).
 */
export const startAway = async (seatId, userId) => {
  const seat = await Seat.findById(seatId);
  if (!seat) {
    const error = new Error('Seat not found');
    error.statusCode = 404;
    throw error;
  }

  if (seat.status !== 'occupied' || seat.occupiedBy?.toString() !== userId.toString()) {
    const error = new Error('You are not checked into this seat');
    error.statusCode = 400;
    throw error;
  }

  const awayUntil = new Date(Date.now() + env.AWAY_MAX_MINUTES * 60 * 1000);
  seat.status = 'away';
  seat.awayUntil = awayUntil;
  await seat.save();

  await ActivityLog.create({
    seatId: seat._id,
    userId,
    action: 'away_start',
    metadata: { seatNumber: seat.seatNumber, awayUntil },
  });

  logger.info(`Away: User ${userId} → Seat ${seat.seatNumber} (until ${awayUntil.toISOString()})`);

  return seat.populate('occupiedBy', 'name email role');
};

/**
 * Return from Away mode.
 */
export const returnFromAway = async (seatId, userId) => {
  const seat = await Seat.findById(seatId);
  if (!seat) {
    const error = new Error('Seat not found');
    error.statusCode = 404;
    throw error;
  }

  if (seat.occupiedBy?.toString() !== userId.toString()) {
    const error = new Error('You are not checked into this seat');
    error.statusCode = 400;
    throw error;
  }

  if (seat.status !== 'away') {
    const error = new Error('Seat is not in Away mode');
    error.statusCode = 400;
    throw error;
  }

  seat.status = 'occupied';
  seat.awayUntil = null;
  seat.lastPresenceConfirmation = new Date();
  await seat.save();

  await ActivityLog.create({
    seatId: seat._id,
    userId,
    action: 'away_end',
    metadata: { seatNumber: seat.seatNumber },
  });

  logger.info(`Return: User ${userId} → Seat ${seat.seatNumber}`);

  return seat.populate('occupiedBy', 'name email role');
};

/**
 * Check out from a seat.
 */
export const checkOut = async (seatId, userId) => {
  const seat = await Seat.findById(seatId);
  if (!seat) {
    const error = new Error('Seat not found');
    error.statusCode = 404;
    throw error;
  }

  if (seat.occupiedBy?.toString() !== userId.toString()) {
    const error = new Error('You are not checked into this seat');
    error.statusCode = 400;
    throw error;
  }

  const sessionDuration = seat.checkInTime
    ? Math.round((Date.now() - seat.checkInTime.getTime()) / 60000)
    : 0;

  seat.status = 'available';
  seat.occupiedBy = null;
  seat.checkInTime = null;
  seat.awayUntil = null;
  seat.lastPresenceConfirmation = null;
  seat.abandoned = false;
  await seat.save();

  await ActivityLog.create({
    seatId: seat._id,
    userId,
    action: 'check_out',
    metadata: { seatNumber: seat.seatNumber, sessionDuration },
  });

  logger.info(`Checkout: User ${userId} → Seat ${seat.seatNumber} (${sessionDuration} min)`);

  return seat;
};

/**
 * Confirm presence (anti-hoarding).
 */
export const confirmPresence = async (userId) => {
  const seat = await Seat.findOne({
    occupiedBy: userId,
    status: { $in: ['occupied', 'away'] },
  });

  if (!seat) {
    const error = new Error('You do not have an active seat');
    error.statusCode = 400;
    throw error;
  }

  seat.lastPresenceConfirmation = new Date();
  seat.abandoned = false;
  await seat.save();

  await ActivityLog.create({
    seatId: seat._id,
    userId,
    action: 'presence_confirmed',
    metadata: { seatNumber: seat.seatNumber },
  });

  logger.info(`Presence confirmed: User ${userId} → Seat ${seat.seatNumber}`);

  return seat;
};

/**
 * Force release a seat (used by jobs and admin).
 */
export const releaseSeat = async (seatId, reason = 'auto_release') => {
  const seat = await Seat.findById(seatId);
  if (!seat) return null;

  const userId = seat.occupiedBy;

  seat.status = 'available';
  seat.occupiedBy = null;
  seat.checkInTime = null;
  seat.awayUntil = null;
  seat.lastPresenceConfirmation = null;
  seat.abandoned = false;
  await seat.save();

  await ActivityLog.create({
    seatId: seat._id,
    userId,
    action: reason,
    metadata: { seatNumber: seat.seatNumber },
  });

  logger.info(`Release (${reason}): Seat ${seat.seatNumber}`);

  return seat;
};

/**
 * Find seat by seatNumber (for QR check-in).
 */
export const findBySeatNumber = async (seatNumber) => {
  const seat = await Seat.findOne({ seatNumber }).populate('occupiedBy', 'name email role');
  if (!seat) {
    const error = new Error(`Seat '${seatNumber}' not found`);
    error.statusCode = 404;
    throw error;
  }
  return seat;
};
