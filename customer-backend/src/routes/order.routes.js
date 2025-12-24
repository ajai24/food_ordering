import { Router } from 'express';
import { createOrder, listOrders, updateOrderStatus } from '../controllers/order.controller.js';

const router = Router();

router.get('/', listOrders);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;
