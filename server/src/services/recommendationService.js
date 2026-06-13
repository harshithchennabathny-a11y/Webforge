import Seat from '../models/Seat.js';
import logger from '../utils/logger.js';

/**
 * Smart Seat Recommendation Engine.
 *
 * Scoring algorithm considers:
 * - Seat availability (required)
 * - Charging port preference
 * - Window preference
 * - Quiet zone preference
 * - Zone crowd density (less crowded = better)
 * - Popularity score (higher = better)
 */
export const getRecommendations = async (preferences = {}) => {
  const availableSeats = await Seat.find({ status: 'available' });

  if (availableSeats.length === 0) {
    return [];
  }

  // Get all seats for zone-level crowd density calculation
  const allSeats = await Seat.find({});
  const zones = [...new Set(allSeats.map((s) => s.zone))];

  // Pre-compute zone density (occupied percentage)
  const zoneDensity = {};
  for (const zone of zones) {
    const zoneSeats = allSeats.filter((s) => s.zone === zone);
    const occupied = zoneSeats.filter((s) => s.status !== 'available').length;
    zoneDensity[zone] = zoneSeats.length > 0 ? occupied / zoneSeats.length : 0;
  }

  // Score each available seat
  const scored = availableSeats.map((seat) => {
    let score = 50; // base score
    const reasons = [];

    // Charging port (+15)
    if (seat.hasChargingPort) {
      score += 15;
      reasons.push('Charging Port');
    }

    // Window seat (+12)
    if (seat.nearWindow) {
      score += 12;
      reasons.push('Window Seat');
    }

    // Quiet zone (+10)
    if (seat.quietZone) {
      score += 10;
      reasons.push('Quiet Zone');
    }

    // Low crowd density (+15 max, proportional to how empty the zone is)
    const density = zoneDensity[seat.zone] || 0;
    const crowdBonus = Math.round((1 - density) * 15);
    score += crowdBonus;
    if (density < 0.4) {
      reasons.push('Low Traffic Zone');
    }

    // Popularity bonus (+8 max)
    const popularityBonus = Math.round((seat.popularityScore / 100) * 8);
    score += popularityBonus;
    if (seat.popularityScore > 70) {
      reasons.push('Popular Seat');
    }

    // Preference matching bonuses
    if (preferences.charging && seat.hasChargingPort) score += 5;
    if (preferences.window && seat.nearWindow) score += 5;
    if (preferences.quiet && seat.quietZone) score += 5;

    return {
      seat: seat.seatNumber,
      seatId: seat._id,
      floor: seat.floor,
      zone: seat.zone,
      score: Math.min(100, score),
      reason: reasons.join(' + ') || 'Available Seat',
      features: {
        hasChargingPort: seat.hasChargingPort,
        nearWindow: seat.nearWindow,
        quietZone: seat.quietZone,
      },
    };
  });

  // Sort by score descending, return top 5
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 5);

  logger.info(`Recommendations generated: ${top.length} seats scored`);
  return top;
};
