import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  rating: { type: Number, min: 0 },
  district: { type: String },
  type: { type: String },
  studentsCount: { type: Number, default: 0 },
  maxperYear: { type: Number, required: true },
  receiverd: { type: Number, default: 0 }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});



schoolSchema.virtual('hasPlaces').get(function () {
  return this.receiverd < this.maxperYear;
});

const School = mongoose.model('School', schoolSchema);

export default School;