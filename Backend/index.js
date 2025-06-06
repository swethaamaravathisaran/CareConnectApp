import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import sgMail from '@sendgrid/mail';
import axios from 'axios';

import babyRoutes from './Routes/babyRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import vaccinationRoutes from './Routes/vaccinationRoutes.js';
import lullabyRoutes from './Routes/lullabyRoutes.js';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://care-connect-app-jjd8.vercel.app',
      'https://care-connect-app-jjd8-swethas-projects-c63ca06f.vercel.app'
    ],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/babies', babyRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/lullabies', lullabyRoutes);

// SendGrid email endpoint
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) return res.status(400).json({ error: 'Missing required fields' });

  const msg = {
    to,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject,
    text,
    html: `<p>${text.replace(/\n/g, '<br>')}</p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: '✅ Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Root and fallback
app.get('/', (req, res) => {
  res.send('🚀 CareConnect API is running');
});
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
