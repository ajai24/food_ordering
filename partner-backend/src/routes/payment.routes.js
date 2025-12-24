import { Router } from 'express';
import { getPaymentStatus, processPayment } from '../controllers/payment.controller.js';

const router = Router();

router.post('/', processPayment);
router.get('/:id', getPaymentStatus);

export default router;
