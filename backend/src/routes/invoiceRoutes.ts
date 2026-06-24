import { Router } from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoicePdf,
} from '../controllers/invoiceController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Protect all invoice routes - Admin only feature
router.use(protect);
router.use(adminOnly);

router.route('/')

  .get(getInvoices)
  .post(createInvoice);

router.get('/:id/pdf', getInvoicePdf);

router.route('/:id')
  .get(getInvoiceById)
  .put(updateInvoice)
  .delete(deleteInvoice);

export default router;
