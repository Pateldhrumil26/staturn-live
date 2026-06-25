import { Request, Response } from 'express';
import { Invoice } from '../models/Invoice.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Helper to auto-generate the next sequential invoice number
const generateNextInvoiceNumber = async (): Promise<string> => {
  let attempts = 0;
  let nextNum = 10001;

  while (attempts < 10) {
    // Find the latest invoice sorted by createdAt descending
    const lastInvoice = await Invoice.findOne({}, { invoiceNumber: 1 })
      .sort({ createdAt: -1 })
      .limit(1);

    if (lastInvoice && lastInvoice.invoiceNumber) {
      const match = lastInvoice.invoiceNumber.match(/^INV-(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    const prospectiveNumber = `INV-${nextNum}`;
    // Verify it doesn't already exist (in case of manual changes or deletion gaps)
    const existing = await Invoice.findOne({ invoiceNumber: prospectiveNumber });
    if (!existing) {
      return prospectiveNumber;
    }
    nextNum++;
    attempts++;
  }
  
  // Fallback to timestamp if sequence generation repeatedly collides
  return `INV-${Date.now()}`;
};

// Helper to calculate totals for an invoice's products
const calculateInvoiceTotals = (products: any[], gstPercentage: number) => {
  let subtotal = 0;
  
  products.forEach((p) => {
    const qty = Number(p.quantity) || 0;
    const price = Number(p.unitPrice) || 0;
    const disc = Number(p.discount) || 0;
    
    // Line total = (Quantity * UnitPrice) - Discount
    const lineTotal = (qty * price) - disc;
    subtotal += Math.max(0, lineTotal);
  });

  const gstPct = Number(gstPercentage) || 0;
  const gstAmount = subtotal * (gstPct / 100);
  const grandTotal = subtotal + gstAmount;

  // Round to 2 decimal places
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
};

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private/Admin
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      mobile,
      address,
      gstNumber,
      invoiceDate,
      products,
      gstPercentage,
      status,
    } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product is required' });
    }

    // Auto-generate sequential invoice number
    const invoiceNumber = await generateNextInvoiceNumber();

    // Calculate totals
    const gstPct = gstPercentage !== undefined ? Number(gstPercentage) : 18;
    const totals = calculateInvoiceTotals(products, gstPct);

    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      mobile,
      address,
      gstNumber,
      invoiceDate: invoiceDate || new Date(),
      products,
      gstPercentage: gstPct,
      subtotal: totals.subtotal,
      gstAmount: totals.gstAmount,
      grandTotal: totals.grandTotal,
      status: status || 'Pending',
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all invoices (with pagination, date filters, search, and sorting)
// @route   GET /api/invoices
// @access  Private/Admin
export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { search, status, startDate, endDate, page, limit } = req.query;
    const query: any = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Search by Invoice Number or Customer Name
    if (search) {
      const searchStr = search.toString().trim();
      query.$or = [
        { invoiceNumber: { $regex: searchStr, $options: 'i' } },
        { customerName: { $regex: searchStr, $options: 'i' } },
      ];
    }

    // Date range filters
    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) {
        query.invoiceDate.$gte = new Date(startDate.toString());
      }
      if (endDate) {
        const end = new Date(endDate.toString());
        end.setHours(23, 59, 59, 999);
        query.invoiceDate.$lte = end;
      }
    }

    // Pagination calculations
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    const total = await Invoice.countDocuments(query);
    const invoices = await Invoice.find(query)
      .populate('products.product', 'name images')
      .sort({ invoiceDate: -1, createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get a single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private/Admin
export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('products.product', 'name images category');

    if (invoice) {
      res.json({ success: true, data: invoice });
    } else {
      res.status(404).json({ success: false, message: 'Invoice not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update an existing invoice
// @route   PUT /api/invoices/:id
// @access  Private/Admin
export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      mobile,
      address,
      gstNumber,
      invoiceDate,
      products,
      gstPercentage,
      status,
    } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Update customer and general details if provided
    if (customerName) invoice.customerName = customerName;
    if (mobile !== undefined) invoice.mobile = mobile;
    if (address !== undefined) invoice.address = address;
    if (gstNumber !== undefined) invoice.gstNumber = gstNumber;
    if (invoiceDate) invoice.invoiceDate = invoiceDate;
    if (status) invoice.status = status;

    // Update products and recalculate totals if products array is specified
    if (products && Array.isArray(products)) {
      if (products.length === 0) {
        return res.status(400).json({ success: false, message: 'At least one product is required' });
      }
      invoice.products = products as any;
    }

    // If gstPercentage is provided, or products are updated, recalculate
    const gstPct = gstPercentage !== undefined ? Number(gstPercentage) : invoice.gstPercentage;
    invoice.gstPercentage = gstPct;

    const totals = calculateInvoiceTotals(invoice.products, gstPct);
    invoice.subtotal = totals.subtotal;
    invoice.gstAmount = totals.gstAmount;
    invoice.grandTotal = totals.grandTotal;

    const updatedInvoice = await invoice.save();
    res.json({ success: true, data: updatedInvoice });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice) {
      await invoice.deleteOne();
      res.json({ success: true, message: 'Invoice removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Invoice not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get Invoice PDF Stream
// @route   GET /api/invoices/:id/pdf
// @access  Private/Admin
export const getInvoicePdf = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Initialize A4 page document
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    // Draw Brand Header
    doc.setFontSize(20);
    doc.setTextColor(202, 40, 39); // Brand Red (#CA2827)
    doc.setFont('helvetica', 'bold');
    doc.text('STATURN LIGHT.', 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text('Saturn Light Corporation', 14, 26);
    doc.text('Plot No. 45, Industrial Area Phase II, Delhi - 110020', 14, 31);
    doc.text('GSTIN: 07AAAAA1111A1Z1 | Tel: +91 9988776655', 14, 36);

    // Document Title & Metadata
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 140, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice Number : ${invoice.invoiceNumber}`, 140, 26);
    doc.text(`Invoice Date   : ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}`, 140, 31);
    doc.text(`Status         : ${invoice.status}`, 140, 36);

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 42, 196, 42);

    // Customer & Shipping Address Columns
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO:', 14, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customerName, 14, 53);
    if (invoice.mobile) doc.text(`Contact: ${invoice.mobile}`, 14, 58);
    if (invoice.gstNumber) doc.text(`GSTIN: ${invoice.gstNumber}`, 14, 63);

    doc.setFont('helvetica', 'bold');
    doc.text('SHIPPING / DELIVERY ADDRESS:', 110, 48);
    doc.setFont('helvetica', 'normal');
    const addressLines = doc.splitTextToSize(invoice.address || 'No address specified', 85);
    doc.text(addressLines, 110, 53);

    // Prepare line item table data
    const headers = [['#', 'Product Name / Description', 'Qty', 'Unit Price', 'Discount', 'Total Price']];
    const tableData = invoice.products.map((p: any, idx: number) => {
      const total = (p.quantity * p.unitPrice) - p.discount;
      return [
        (idx + 1).toString(),
        p.name,
        p.quantity.toString(),
        `INR ${p.unitPrice.toFixed(2)}`,
        p.discount > 0 ? `INR ${p.discount.toFixed(2)}` : '-',
        `INR ${total.toFixed(2)}`,
      ];
    });

    // Render Grid using jspdf-autotable hook
    (doc as any).autoTable({
      startY: 72,
      head: headers,
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [202, 40, 39], textColor: [255, 255, 255] },
      styles: { fontSize: 8.5 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 30, halign: 'right' },
      },
    });

    // Summary calculations block
    const finalY = (doc as any).lastAutoTable.finalY + 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 125, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(`INR ${invoice.subtotal.toFixed(2)}`, 165, finalY);

    doc.setFont('helvetica', 'bold');
    doc.text(`GST (${invoice.gstPercentage}%):`, 125, finalY + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(`INR ${invoice.gstAmount.toFixed(2)}`, 165, finalY + 5);

    doc.setFont('helvetica', 'bold');
    doc.text('Grand Total:', 125, finalY + 11);
    doc.text(`INR ${invoice.grandTotal.toFixed(2)}`, 165, finalY + 11);

    // Terms and Conditions text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions:', 14, finalY + 25);
    doc.setFont('helvetica', 'normal');
    doc.text('1. Goods once sold will not be returned or exchanged.', 14, finalY + 29);
    doc.text('2. Interest at 18% charged if unpaid after 30 days.', 14, finalY + 33);

    // Authorized signatory block
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('For Saturn Light Corporation', 135, finalY + 25);
    doc.line(135, finalY + 39, 185, finalY + 39);
    doc.text('Authorized Signatory', 142, finalY + 43);

    // Stream PDF buffer response
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating PDF on backend:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
