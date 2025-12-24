import { Router } from 'express';
import { addAddress, getProfile, upsertProfile } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', getProfile);
router.put('/me', upsertProfile);
router.post('/me/addresses', addAddress);

export default router;
