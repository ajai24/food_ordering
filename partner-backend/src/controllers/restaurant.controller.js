import { Restaurant } from '../models/Restaurant.js';

export const listRestaurants = async (_req, res) => {
  try {
    const restaurants = await Restaurant.find().lean();
    res.json(restaurants);
  } catch (error) {
    console.error('Listing restaurants failed', error);
    res.status(500).json({ message: 'Unable to list restaurants.' });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Fetching restaurant failed', error);
    res.status(500).json({ message: 'Unable to fetch restaurant.' });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Creating restaurant failed', error);
    res.status(500).json({ message: 'Unable to create restaurant.' });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { menu: req.body.menu },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Updating menu failed', error);
    res.status(500).json({ message: 'Unable to update menu.' });
  }
};
