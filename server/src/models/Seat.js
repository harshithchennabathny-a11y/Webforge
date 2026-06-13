import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: [true, 'Seat number is required'],
      unique: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: [true, 'Floor is required'],
      min: 1,
    },
    zone: {
      type: String,
      required: [true, 'Zone is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'away', 'abandoned'],
      default: 'available',
    },
    occupiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    awayUntil: {
      type: Date,
      default: null,
    },
    lastPresenceConfirmation: {
      type: Date,
      default: null,
    },
    abandoned: {
      type: Boolean,
      default: false,
    },

    // Seat features
    hasChargingPort: {
      type: Boolean,
      default: false,
    },
    nearWindow: {
      type: Boolean,
      default: false,
    },
    quietZone: {
      type: Boolean,
      default: false,
    },
    popularityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
seatSchema.index({ status: 1 });
seatSchema.index({ floor: 1, zone: 1 });
seatSchema.index({ status: 1, floor: 1 });
seatSchema.index({ occupiedBy: 1 });

const Seat = mongoose.model('Seat', seatSchema);
export default Seat;
