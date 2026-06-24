import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { Invoice } from '../types/index.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  ArrowLeft,
  Printer,
  Edit2,
  FileText,
  Building2,
  User,
  CheckCircle,
  Clock,
  XCircle,
  FileDown,
} from 'lucide-react';

export const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ref for print layout target
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const response = await API.get(`/invoices/${id}`);
        if (response.data.success) {
          setInvoice(response.data.data);
        }
      } catch (err: any) {
        console.error('Error fetching invoice details:', err);
        setError(err.response?.data?.message || 'Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  // Set up react-to-print hook
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: invoice ? `invoice-${invoice.invoiceNumber}` : 'invoice',
  });

  // Trigger print immediately on mount if ?print=true query is present
  useEffect(() => {
    if (invoice && window.location.search.includes('print=true')) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [invoice, handlePrint]);

  // Client-side PDF generation using jsPDF & jspdf-autotable
  const handleDownloadPDF = () => {
    if (!invoice) return;
    
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    // Draw stylized header
    doc.setFontSize(20);
    doc.setTextColor(202, 40, 39); // Saturn Red (#CA2827)
    doc.setFont('helvetica', 'bold');
    doc.text('STATURN LIGHT.', 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text('Saturn Light Corporation', 14, 26);
    doc.text('Plot No. 45, Industrial Area Phase II, Delhi - 110020', 14, 31);
    doc.text('GSTIN: 07AAAAA1111A1Z1 | Tel: +91 9988776655', 14, 36);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 140, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice Number : ${invoice.invoiceNumber}`, 140, 26);
    doc.text(`Invoice Date   : ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}`, 140, 31);
    doc.text(`Status         : ${invoice.status}`, 140, 36);

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 42, 196, 42);

    // Client columns
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

    // Grid data
    const headers = [['#', 'Product Name / Description', 'Qty', 'Unit Price', 'Discount', 'Total Price']];
    const tableData = invoice.products.map((p, idx) => {
      const rowTotal = (p.quantity * p.unitPrice) - p.discount;
      return [
        (idx + 1).toString(),
        p.name,
        p.quantity.toString(),
        `INR ${p.unitPrice.toFixed(2)}`,
        p.discount > 0 ? `INR ${p.discount.toFixed(2)}` : '-',
        `INR ${rowTotal.toFixed(2)}`,
      ];
    });

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

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions:', 14, finalY + 25);
    doc.setFont('helvetica', 'normal');
    doc.text('1. Goods once sold will not be returned or exchanged.', 14, finalY + 29);
    doc.text('2. Interest at 18% charged if unpaid after 30 days.', 14, finalY + 33);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('For Saturn Light Corporation', 135, finalY + 25);
    doc.line(135, finalY + 39, 185, finalY + 39);
    doc.text('Authorized Signatory', 142, finalY + 43);

    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-250 uppercase tracking-wider">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Paid</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-250 uppercase tracking-wider">
            <XCircle className="h-3.5 w-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-250 uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#FAF9F6] min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6 md:p-10 max-w-7xl">
        {/* Actions Menu Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/invoices"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-250 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-display">
                Invoice Console
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Detailed invoice item view, printer configuration, and PDF export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start font-display text-xs font-bold uppercase tracking-wider">
            {invoice && (
              <>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-full bg-white border border-gray-250 text-gray-700 px-4 py-2.5 hover:bg-gray-50 shadow-xs transition-all cursor-pointer font-display"
                >
                  <Printer className="h-4 w-4 text-brand" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 rounded-full bg-white border border-gray-250 text-gray-700 px-4 py-2.5 hover:bg-gray-50 shadow-xs transition-all cursor-pointer font-display"
                >
                  <FileDown className="h-4 w-4 text-brand" />
                  <span>Download PDF</span>
                </button>
                <Link
                  to={`/admin/invoices/edit/${invoice._id}`}
                  className="flex items-center gap-1.5 rounded-full bg-brand text-white px-5 py-2.5 hover:bg-brand-hover shadow-md transition-all font-display"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Invoice</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : error || !invoice ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-bold">
            {error || 'Invoice not found.'}
          </div>
        ) : (
          /* Render Printable layout block */
          <div
            ref={printRef}
            className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-10 space-y-8 print:p-0 print:border-none print:shadow-none"
          >
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-gray-150 pb-8">
              <div className="space-y-4">
                <span className="font-display text-3xl font-black tracking-tight text-gray-900">
                  Staturn light<span className="text-brand">.</span>
                </span>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-gray-400">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Company Details</span>
                  </div>
                  <p className="font-semibold text-gray-700">Saturn Light Corporation</p>
                  <p>Plot No. 45, Industrial Area Phase II,</p>
                  <p>New Delhi, Delhi - 110020, India</p>
                  <p>GSTIN: 07AAAAA1111A1Z1</p>
                  <p>Email: billing@saturnlight.com | Tel: +91 9988776655</p>
                </div>
              </div>

              <div className="text-left md:text-right space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Invoice Reference</span>
                  <span className="text-xl font-mono font-black text-gray-900 tracking-wider block">{invoice.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Invoice Date</span>
                  <span className="text-xs font-semibold text-gray-750 block">
                    {new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Billing Status</span>
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
            </div>

            {/* Customer parameters */}
            <div className="bg-[#FAF9F6] border border-gray-150 rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2 mb-2">
                <User className="h-4 w-4 text-brand" />
                <span>Billed To (Customer Information)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold text-gray-400 uppercase tracking-wider text-[9px] block">Customer Name</span>
                    <span className="font-bold text-gray-800 text-sm">{invoice.customerName}</span>
                  </div>
                  {invoice.mobile && (
                    <div>
                      <span className="font-semibold text-gray-400 uppercase tracking-wider text-[9px] block">Contact Number</span>
                      <span className="font-bold text-gray-700">{invoice.mobile}</span>
                    </div>
                  )}
                  {invoice.gstNumber && (
                    <div>
                      <span className="font-semibold text-gray-400 uppercase tracking-wider text-[9px] block">Customer GSTIN</span>
                      <span className="font-bold text-gray-700 font-mono">{invoice.gstNumber}</span>
                    </div>
                  )}
                </div>

                <div>
                  <span className="font-semibold text-gray-400 uppercase tracking-wider text-[9px] block">Billing / Delivery Address</span>
                  <span className="font-medium text-gray-600 block leading-relaxed whitespace-pre-line">
                    {invoice.address || 'No address specified.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Product table breakdown */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-[#FAF9F6] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Item #</th>
                    <th scope="col" className="px-6 py-4">Product Name / Description</th>
                    <th scope="col" className="px-6 py-4 text-center">Qty</th>
                    <th scope="col" className="px-6 py-4 text-right">Unit Price</th>
                    <th scope="col" className="px-6 py-4 text-right">Discount</th>
                    <th scope="col" className="px-6 py-4 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-xs font-semibold text-gray-700">
                  {invoice.products.map((p, index) => {
                    const rowTotal = (p.quantity * p.unitPrice) - p.discount;
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-400 font-mono">{index + 1}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{p.name}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono">{p.quantity}</td>
                        <td className="px-6 py-4 text-right font-mono">{formatPrice(p.unitPrice)}</td>
                        <td className="px-6 py-4 text-right font-mono text-rose-600">
                          {p.discount > 0 ? `-${formatPrice(p.discount)}` : formatPrice(0)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                          {formatPrice(rowTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculations and Summary */}
            <div className="flex justify-end pt-4">
              <div className="w-full md:w-80 bg-[#FAF9F6] border border-gray-150 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-mono text-gray-800">{formatPrice(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-400">GST ({invoice.gstPercentage}%):</span>
                  <span className="font-mono text-gray-800">{formatPrice(invoice.gstAmount)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                  <span className="font-display text-sm font-bold text-gray-900">Grand Total:</span>
                  <span className="font-display text-lg font-black text-brand tracking-tight font-mono">
                    {formatPrice(invoice.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature & Legal Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="text-[10px] text-gray-400 space-y-2 leading-relaxed">
                <span className="font-bold text-gray-700 uppercase tracking-wider block">Terms & Conditions:</span>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Goods once sold will not be returned or exchanged.</li>
                  <li>Interest at 18% charged if payment overdue.</li>
                  <li>Subject to Delhi Jurisdiction.</li>
                </ol>
              </div>

              <div className="text-right space-y-12">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">For Saturn Light Corporation</span>
                </div>
                <div className="border-t border-gray-300 w-48 inline-block pt-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Authorized Signatory
                </div>
              </div>
            </div>

            {/* Notice footer */}
            <div className="text-center text-[10px] text-gray-400 border-t border-gray-100 pt-6 print:hidden">
              <p className="font-bold">Thank you for your business!</p>
              <p className="mt-1">This is a system generated invoice. For inquiries, email billing@saturnlight.com or call +91 9988776655.</p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};
export default InvoiceDetails;
