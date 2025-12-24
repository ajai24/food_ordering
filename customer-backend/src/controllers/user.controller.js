import { UserProfile } from '../models/UserProfile.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required.' });
    }

    const profile = await UserProfile.findOne({ userId }).lean();

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Fetching profile failed', error);
    res.status(500).json({ message: 'Unable to fetch profile.' });
  }
};

export const upsertProfile = async (req, res) => {
  try {
    const { userId, ...payload } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Updating profile failed', error);
    res.status(500).json({ message: 'Unable to update profile.' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { userId, label, street, city, state, postalCode } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        $push: {
          addresses: { label, street, city, state, postalCode }
        }
      },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    console.error('Adding address failed', error);
    res.status(500).json({ message: 'Unable to add address.' });
  }
};
