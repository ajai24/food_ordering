import { Router } from 'express';
import {
  createRestaurant,
  getRestaurant,
  listRestaurants,
  updateMenu
} from '../controllers/restaurant.controller.js';

const router = Router();

router.get('/', listRestaurants);
router.get('/:id', getRestaurant);
router.post('/', createRestaurant);
router.put('/:id/menu', updateMenu);

export default router;
