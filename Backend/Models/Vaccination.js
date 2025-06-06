import mongoose from 'mongoose';

const vaccinationSchema = new mongoose.Schema({
  baby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BabyProfile', // 👈 Make sure your Baby model is named 'Baby'
    required: true,
  },
  vaccineName: {
    type: String,
    required: true,
  },
  scheduledDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',
  },
});

export default mongoose.model('Vaccination', vaccinationSchema);
