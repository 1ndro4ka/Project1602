import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
    },
    documents: {
      parent_statement: {
        filename: String,
        originalName: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
      medical_cert: {
        filename: String,
        originalName: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
      health_passport: {
        filename: String,
        originalName: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
      photos: [
        {
          filename: String,
          originalName: String,
          size: Number,
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
    status: {
      type: String,
      enum: ['pending', 'received', 'verified', 'rejected'],
      default: 'pending',
    },
    notes: String,
    rejectionReason: String,
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Document', DocumentSchema);
