import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import babyRoutes from './Routes/babyRoutes.js';
import authRoutes from './Routes/authRoutes.js';
// import feedingRoutes from './Routes/feedingRoutes.js';
// import sleepRoutes from './Routes/sleepRoutes.js';
// import diaperRoutes from './Routes/diaperRoutes.js';
// import healthRoutes from './Routes/healthRoutes.js';
// import journalRoutes from './Routes/journalRoutes.js';

dotenv.config();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/babies', babyRoutes);
// app.use('/api/feedings', feedingRoutes);
// app.use('/api/sleep', sleepRoutes);
// app.use('/api/diapers', diaperRoutes);
// app.use('/api/health', healthRoutes);
// app.use('/api/journal', journalRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 CareConnect API is running and connected to MongoDB');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
