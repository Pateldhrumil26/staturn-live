import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { Invoice } from '../types/index.js';
import { Printer, ArrowLeft } from 'lucide-react';

export const InvoicePrint: React.FC = () => {
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
        console.error('Error fetching invoice details for printing:', err);
        setError(err.response?.data?.message || 'Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  // Trigger print dialog once data is loaded and rendered
  useEffect(() => {
    if (invoice) {
      const timer = setTimeout(() => {
        window.print();
      }, 800); // 800ms buffer to ensure font rendering and DOM updates are solid
      return () => clearTimeout(timer);
    }
  }, [invoice]);

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    navigate(-1); // return to previous view page
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent mx-auto"></div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Preparing print layout...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-10 bg-white min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-red-600 font-bold text-sm bg-red-55 border border-red-200 p-4 rounded-xl">
            {error || 'Invoice not found.'}
          </div>
          <button
            onClick={handleGoBack}
            className="rounded-full bg-gray-900 px-6 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-black"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-black antialiased font-sans p-6 md:p-12">
      {/* Print control banner - hidden during print */}
      <div className="print:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white py-3 px-6 shadow-md flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-wider text-gray-400">
            Invoice: {invoice.invoiceNumber}
          </span>
          <span className="inline-block h-4 w-[1px] bg-gray-700"></span>
          <span className="text-[10px] text-brand uppercase font-extrabold tracking-wider">Print Preview Mode</span>
        </div>
        <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-wider">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1.5 rounded-full border border-gray-700 px-4 py-2 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-white hover:bg-brand-hover shadow-sm transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* spacer to offset the fixed print control bar when viewing on screen */}
      <div className="print:hidden h-14"></div>

      {/* Printable Invoice Page Area */}
      <div className="max-w-4xl mx-auto space-y-8 bg-white my-4 print:my-0">
        
        {/* Company Header & Brand Info */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6">
          <div className="space-y-3">
            <span className="text-2xl font-black tracking-tight uppercase block font-display">
              Staturn light<span className="text-red-650">.</span>
            </span>
            <div className="text-xs space-y-0.5 text-gray-700">
              <p className="font-extrabold text-black">Saturn Light Corporation</p>
              <p>Plot No. 45, Industrial Area Phase II,</p>
              <p>New Delhi, Delhi - 110020, India</p>
              <p className="font-bold">GSTIN: 07AAAAA1111A1Z1</p>
              <p>Email: billing@saturnlight.com | Tel: +91 9988776655</p>
            </div>
          </div>

          <div className="text-right space-y-2">
            <h1 className="text-xl font-black uppercase tracking-wider text-gray-900 font-display">TAX INVOICE</h1>
            <div className="text-xs space-y-1 text-gray-700">
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px] block">Invoice No</span>
                <span className="font-mono font-bold text-black tracking-wider text-sm">{invoice.invoiceNumber}</span>
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px] block">Invoice Date</span>
                <span className="font-bold text-black">
                  {new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Section */}
        <div className="grid grid-cols-2 gap-8 bg-gray-50 border border-gray-200 p-5 rounded-lg text-xs leading-relaxed">
          <div className="space-y-1.5 border-r border-gray-200 pr-4">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px] block">Billed To (Customer Details)</span>
            <p className="font-extrabold text-black text-sm">{invoice.customerName}</p>
            {invoice.mobile && (
              <p>
                <span className="font-bold text-gray-500">Contact:</span> {invoice.mobile}
              </p>
            )}
            {invoice.gstNumber && (
              <p>
                <span className="font-bold text-gray-500 font-mono">GSTIN:</span> <span className="font-mono font-bold text-black">{invoice.gstNumber}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5 pl-4">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px] block">Billing / Delivery Address</span>
            <p className="font-medium text-gray-800 whitespace-pre-line">
              {invoice.address || 'No address specified.'}
            </p>
          </div>
        </div>

        {/* Products line table */}
        <table className="min-w-full text-left text-xs border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-[10px] font-bold text-black uppercase tracking-wider border-b border-gray-350">
              <th scope="col" className="px-4 py-3 border-r border-gray-300 w-12 text-center">#</th>
              <th scope="col" className="px-4 py-3 border-r border-gray-300">Product Name / Description</th>
              <th scope="col" className="px-4 py-3 border-r border-gray-300 text-center w-16">Qty</th>
              <th scope="col" className="px-4 py-3 border-r border-gray-300 text-right w-32">Unit Price</th>
              <th scope="col" className="px-4 py-3 border-r border-gray-300 text-right w-28">Discount</th>
              <th scope="col" className="px-4 py-3 text-right w-36">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 font-medium text-gray-800">
            {invoice.products.map((p, index) => {
              const rowTotal = (p.quantity * p.unitPrice) - p.discount;
              return (
                <tr key={index} className="align-middle">
                  <td className="px-4 py-3 border-r border-gray-300 text-center font-mono">{index + 1}</td>
                  <td className="px-4 py-3 border-r border-gray-300 font-bold text-black">{p.name}</td>
                  <td className="px-4 py-3 border-r border-gray-300 text-center font-mono">{p.quantity}</td>
                  <td className="px-4 py-3 border-r border-gray-300 text-right font-mono">{formatPrice(p.unitPrice)}</td>
                  <td className="px-4 py-3 border-r border-gray-300 text-right font-mono text-gray-500">
                    {p.discount > 0 ? `-${formatPrice(p.discount)}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-black">{formatPrice(rowTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Calculations and Signature lines */}
        <div className="grid grid-cols-2 gap-8 pt-4 items-end">
          {/* Left Block: Terms / Bank Details placeholder */}
          <div className="text-[10px] text-gray-500 space-y-2 leading-relaxed">
            <span className="font-bold text-black uppercase tracking-wider block">Terms & Conditions:</span>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Goods once sold will not be taken back or exchanged.</li>
              <li>Interest at 18% per annum will be charged if payment is not cleared in 30 days.</li>
              <li>Subject to New Delhi jurisdiction only.</li>
            </ol>
            <div className="pt-2">
              <span className="font-bold text-black uppercase tracking-wider block">Bank Details for Wire Transfer:</span>
              <p>Account Name: Saturn Light Corporation Ltd</p>
              <p>Bank: HDFC Bank Ltd, New Delhi Branch</p>
              <p>A/C Number: 50200012345678 | IFSC Code: HDFC0000123</p>
            </div>
          </div>

          {/* Right Block: Calculations & Totals */}
          <div className="flex flex-col items-end">
            <div className="w-full max-w-xs border border-gray-300 rounded-lg p-4 space-y-2 text-xs leading-none">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-mono text-black">{formatPrice(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between font-semibold border-b border-gray-200 pb-2">
                <span className="text-gray-500">GST ({invoice.gstPercentage}%):</span>
                <span className="font-mono text-black">{formatPrice(invoice.gstAmount)}</span>
              </div>
              <div className="pt-1 flex justify-between items-baseline font-black">
                <span className="font-display uppercase tracking-wider text-[10px] text-black">Grand Total:</span>
                <span className="font-mono text-base text-black tracking-tight">{formatPrice(invoice.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signature lines */}
        <div className="grid grid-cols-2 gap-8 pt-16 text-center text-xs">
          <div>
            <div className="border-t border-gray-350 w-48 mx-auto pt-2 text-gray-500">Customer Signature</div>
          </div>
          <div>
            <div className="w-48 mx-auto space-y-1">
              <span className="text-[10px] text-gray-500 font-bold block">For Saturn Light Corporation</span>
              <div className="h-10"></div> {/* Sign stamp area */}
              <div className="border-t border-gray-350 pt-2 text-gray-500 font-bold">Authorized Signatory</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default InvoicePrint;
