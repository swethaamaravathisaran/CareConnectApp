import Vaccination from '../Models/Vaccination.js';

export const createVaccination = async (req, res) => {
  try {
    const newVacc = new Vaccination(req.body);
    await newVacc.save();
    res.status(201).json(newVacc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create vaccination' });
  }
};

export const getVaccinationsForBaby = async (req, res) => {
  try {
    const vaccinations = await Vaccination.find({ baby: req.params.babyId });
    res.json(vaccinations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vaccinations' });
  }
};

export const updateVaccinationStatus = async (req, res) => {
  try {
    const updated = await Vaccination.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};
