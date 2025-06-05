import express from 'express';
import {
  createBabyProfile,
  getBabyProfiles,
  updateBabyProfile,
  deleteBabyProfile
} from '../controllers/babyController.js';

import protect from '../Middleware/authMiddleware.js';

const router = express.Router();

// Route: /api/babies
router.route('/')
  .post(protect, createBabyProfile)
  .get(protect, getBabyProfiles);

// Route: /api/babies/:id
router.route('/:id')
  .put(protect, updateBabyProfile)
  .delete(protect, deleteBabyProfile);

export default router;
