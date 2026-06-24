import { Request, Response } from 'express';
import { Contact } from '../models/Contact.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
export const submitContactInquiry = async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all contact inquiries (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactInquiries = async (req: AuthRequest, res: Response) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update contact inquiry status (Admin only)
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContactInquiryStatus = async (req: AuthRequest, res: Response) => {
  const { status, adminNotes } = req.body;

  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      contact.status = status || contact.status;
      contact.adminNotes = adminNotes !== undefined ? adminNotes : contact.adminNotes;

      const updatedContact = await contact.save();
      res.json({ success: true, data: updatedContact });
    } else {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete contact inquiry (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactInquiry = async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      await contact.deleteOne();
      res.json({ success: true, message: 'Inquiry removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
