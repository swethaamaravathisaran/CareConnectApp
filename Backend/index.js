const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection failed:', err));

// Import Routes
const authRoutes = require('./Routes/authRoutes');
// const babyRoutes = require('./routes/babyRoutes');
// const feedingRoutes = require('./routes/feedingRoutes');
// const sleepRoutes = require('./routes/sleepRoutes');
// const diaperRoutes = require('./routes/diaperRoutes');
// const healthRoutes = require('./routes/healthRoutes');
// const journalRoutes = require('./routes/journalRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
// app.use('/api/babies', babyRoutes);
// app.use('/api/feedings', feedingRoutes);
// app.use('/api/sleep', sleepRoutes);
// app.use('/api/diapers', diaperRoutes);
// app.use('/api/health', healthRoutes);
// app.use('/api/journal', journalRoutes);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('🚀 CareConnect API is running and connected to MongoDB');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
