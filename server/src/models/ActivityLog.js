import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'check_in',
      'check_out',
      'away_start',
      'away_end',
      'auto_release',
      'abandoned',
      'admin_reset',
      'recommendation_viewed',
      'presence_confirmed',
    ],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for time-based queries and seat lookups
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ seatId: 1, timestamp: -1 });
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
