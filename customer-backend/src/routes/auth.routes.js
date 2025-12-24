import { Router } from 'express';
import { 
  loginUser, 
  registerUser, 
  authLimiter,
  validateSession
} from '../controllers/auth.controller.js';

const router = Router();

// Apply rate limiting to auth endpoints
router.use(authLimiter);

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require valid session)
router.get('/me', validateSession, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.post('/logout', validateSession, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
