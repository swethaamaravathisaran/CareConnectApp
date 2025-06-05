import BabyProfile from '../Models/BabyProfile.js';

// Create a new baby profile
export const createBabyProfile = async (req, res) => {
  try {
    const baby = new BabyProfile({ ...req.body, user: req.userId });
    await baby.save();
    res.status(201).json(baby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create baby profile' });
  }
};

// Get all baby profiles for the logged-in user
export const getBabyProfiles = async (req, res) => {
  try {
    const babies = await BabyProfile.find({ user: req.userId });
    res.status(200).json(babies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch baby profiles' });
  }
};

// Update a baby profile
export const updateBabyProfile = async (req, res) => {
  try {
    const baby = await BabyProfile.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: req.body },
      { new: true }
    );

    if (!baby) {
      return res.status(404).json({ error: 'Baby profile not found or unauthorized' });
    }

    res.status(200).json(baby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update baby profile' });
  }
};

// Delete a specific baby profile
export const deleteBabyProfile = async (req, res) => {
  try {
    const baby = await BabyProfile.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!baby) {
      return res.status(404).json({ error: 'Baby profile not found or unauthorized' });
    }

    res.status(200).json({ message: 'Baby profile deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete baby profile' });
  }
};
