import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Restaurant } from '../models/Restaurant.js';
import { connectDatabase } from '../config/database.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedFilePath = path.resolve(__dirname, 'restaurants.json');

const loadSeedData = () => {
  const raw = fs.readFileSync(seedFilePath, 'utf8');
  return JSON.parse(raw);
};

const seedRestaurants = async () => {
  await connectDatabase();

  const restaurants = loadSeedData();
  await Restaurant.deleteMany({});
  await Restaurant.insertMany(restaurants);

  console.log(`Seeded ${restaurants.length} restaurants.`);
};

seedRestaurants()
  .then(() => mongoose.connection.close())
  .catch((error) => {
    console.error('Restaurant seeding failed', error);
    mongoose.connection.close(() => process.exit(1));
  });
