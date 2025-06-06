import express from 'express';
import {
  createVaccination,
  getVaccinationsForBaby,
  updateVaccinationStatus
} from '../Controllers/vaccinationController.js';

const router = express.Router();

router.post('/', createVaccination);
router.get('/:babyId', getVaccinationsForBaby);
router.put('/:id', updateVaccinationStatus);

export default router;
