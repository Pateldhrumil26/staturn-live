import { Router } from 'express';
import {
  submitContactInquiry,
  getContactInquiries,
  updateContactInquiryStatus,
  deleteContactInquiry,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public submission route
router.post('/', submitContactInquiry);

// Admin-only review routes
router.route('/')
  .get(protect, adminOnly, getContactInquiries);

router.route('/:id')
  .put(protect, adminOnly, updateContactInquiryStatus)
  .delete(protect, adminOnly, deleteContactInquiry);

export default router;
