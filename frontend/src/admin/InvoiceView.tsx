import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { Invoice } from '../types/index.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
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

export const InvoiceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        {/* Navigation Toolbar */}
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
                Invoice Details
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                View billing breakdown, customer parameters, and print records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start font-display text-xs font-bold uppercase tracking-wider">
            {invoice && (
              <>
                <Link
                  to={`/admin/invoices/print/${invoice._id}`}
                  className="flex items-center gap-1.5 rounded-full bg-white border border-gray-250 text-gray-700 px-4 py-2.5 hover:bg-gray-50 shadow-sm transition-all"
                >
                  <Printer className="h-4 w-4 text-brand" />
                  <span>Print Invoice</span>
                </Link>
                <Link
                  to={`/admin/invoices/print/${invoice._id}`}
                  className="flex items-center gap-1.5 rounded-full bg-white border border-gray-250 text-gray-700 px-4 py-2.5 hover:bg-gray-50 shadow-sm transition-all"
                >
                  <FileDown className="h-4 w-4 text-brand" />
                  <span>Download PDF</span>
                </Link>
                <Link
                  to={`/admin/invoices/edit/${invoice._id}`}
                  className="flex items-center gap-1.5 rounded-full bg-brand text-white px-5 py-2.5 hover:bg-brand-hover shadow-md transition-all"
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
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-10 space-y-8">
            
            {/* Header info: Company Logo & Details */}
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

            {/* Customer Details info */}
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

            {/* Line items table */}
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

            {/* Calculations Breakdown */}
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

            {/* Notice Footer info */}
            <div className="text-center text-[10px] text-gray-400 border-t border-gray-100 pt-6">
              <p className="font-bold">Thank you for your business!</p>
              <p className="mt-1">This is a system generated invoice. For inquiries, email billing@saturnlight.com or call +91 9988776655.</p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};
export default InvoiceView;
