import mongoose from 'mongoose';

const analyticsSnapshotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  occupancyRate: {
    type: Number,
    default: 0,
  },
  occupiedSeats: {
    type: Number,
    default: 0,
  },
  availableSeats: {
    type: Number,
    default: 0,
  },
  awaySeats: {
    type: Number,
    default: 0,
  },
  abandonedSeats: {
    type: Number,
    default: 0,
  },
  peakHour: {
    type: String,
    default: null,
  },
  mostPopularZone: {
    type: String,
    default: null,
  },
  avgSessionDuration: {
    type: Number, // in minutes
    default: 0,
  },
});

analyticsSnapshotSchema.index({ date: -1 });

const AnalyticsSnapshot = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
export default AnalyticsSnapshot;
