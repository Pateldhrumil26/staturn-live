import { Request, Response } from 'express';
import { Dealer } from '../models/Dealer.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Submit a dealer inquiry
// @route   POST /api/dealer
// @access  Public
export const submitDealerInquiry = async (req: Request, res: Response) => {
  const {
    companyName,
    contactName,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    website,
    businessType,
    message,
  } = req.body;

  try {
    const dealer = await Dealer.create({
      companyName,
      contactName,
      email,
      phone,
      address: address || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      website: website || '',
      businessType: businessType || '',
      message: message || '',
    });

    res.status(201).json({ success: true, data: dealer });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all dealer inquiries (Admin only)
// @route   GET /api/dealer
// @access  Private/Admin
export const getDealerInquiries = async (req: AuthRequest, res: Response) => {
  try {
    const dealers = await Dealer.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: dealers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current user's submitted inquiries (Dealer & General Contact)
// @route   GET /api/dealer/my-requests
// @access  Private
export const getMyRequests = async (req: AuthRequest, res: Response) => {
  try {
    const email = req.user.email;
    const dealerApplications = await Dealer.find({ email }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: dealerApplications,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update dealer inquiry status (Admin only)
// @route   PUT /api/dealer/:id
// @access  Private/Admin
export const updateDealerInquiryStatus = async (req: AuthRequest, res: Response) => {
  const { status, adminNotes } = req.body;

  try {
    const dealer = await Dealer.findById(req.params.id);

    if (dealer) {
      dealer.status = status || dealer.status;
      dealer.adminNotes = adminNotes !== undefined ? adminNotes : dealer.adminNotes;

      const updatedDealer = await dealer.save();
      res.json({ success: true, data: updatedDealer });
    } else {
      res.status(404).json({ success: false, message: 'Dealer application not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete dealer inquiry (Admin only)
// @route   DELETE /api/dealer/:id
// @access  Private/Admin
export const deleteDealerInquiry = async (req: AuthRequest, res: Response) => {
  try {
    const dealer = await Dealer.findById(req.params.id);

    if (dealer) {
      await dealer.deleteOne();
      res.json({ success: true, message: 'Application removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Dealer application not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
