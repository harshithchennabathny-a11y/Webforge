import mongoose from 'mongoose';

const occupancyHistorySchema = new mongoose.Schema({
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'away', 'abandoned'],
    required: true,
  },
  occupiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  zone: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Indexes for time-travel queries and heatmap aggregation
occupancyHistorySchema.index({ timestamp: -1 });
occupancyHistorySchema.index({ seatId: 1, timestamp: -1 });
occupancyHistorySchema.index({ zone: 1, timestamp: -1 });
occupancyHistorySchema.index({ timestamp: 1, status: 1 });

const OccupancyHistory = mongoose.model('OccupancyHistory', occupancyHistorySchema);
export default OccupancyHistory;
