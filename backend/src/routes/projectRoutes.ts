import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Admin CRUD routes
router.post('/', protect, adminOnly, upload.single('image'), createProject);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

export default router;
