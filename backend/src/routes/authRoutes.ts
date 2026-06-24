import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private profile routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-only user management routes
router.route('/users')
  .get(protect, adminOnly, getAllUsers);

router.route('/users/:id')
  .put(protect, adminOnly, updateUserRole)
  .delete(protect, adminOnly, deleteUser);

export default router;
