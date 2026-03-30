import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  rating: { type: Number, min: 0 },
  district: { type: String },
  type: { type: String },
  studentsCount: { type: Number, default: 0 },
  hasPlaces: { type: Boolean, default: true },
}, { timestamps: true });

const School = mongoose.model('School', schoolSchema);

export default School;
