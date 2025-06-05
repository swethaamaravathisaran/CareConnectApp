import mongoose from 'mongoose';

const babyProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  birthDate: { type: Date, required: true },
  photo: { type: String }, // Optional: URL to photo
}, { timestamps: true });

export default mongoose.model('BabyProfile', babyProfileSchema);
