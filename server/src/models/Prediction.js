import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  hour: {
    type: Number,
    required: true,
    min: 0,
    max: 23,
  },
  predictedOccupancy: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

// Compound index — one prediction per date+hour
predictionSchema.index({ date: 1, hour: 1 }, { unique: true });

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
