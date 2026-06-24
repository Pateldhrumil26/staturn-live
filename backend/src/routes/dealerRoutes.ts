import { Router } from 'express';
import {
  submitDealerInquiry,
  getDealerInquiries,
  getMyRequests,
  updateDealerInquiryStatus,
  deleteDealerInquiry,
} from '../controllers/dealerController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public dealer registration request
router.post('/', submitDealerInquiry);

// Private route for logged-in users to view their own requests
router.get('/my-requests', protect, getMyRequests);

// Admin-only application review routes
router.route('/')
  .get(protect, adminOnly, getDealerInquiries);

router.route('/:id')
  .put(protect, adminOnly, updateDealerInquiryStatus)
  .delete(protect, adminOnly, deleteDealerInquiry);

export default router;
