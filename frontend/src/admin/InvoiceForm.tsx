

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../services/api.js';
import { Product, InvoiceProduct } from '../types/index.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Percent,
  CheckCircle,
  HelpCircle,
  Receipt,
  FileText,
} from 'lucide-react';

interface FormProductRow {
  productId: string; // 'custom' for manual entries, otherwise matches Product _id
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export const InvoiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  // Database products list for selection dropdown
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  
  // General form fields
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [gstPercentage, setGstPercentage] = useState<number>(18);
  const [status, setStatus] = useState<'Paid' | 'Pending' | 'Cancelled'>('Pending');

  // Product rows
  const [productRows, setProductRows] = useState<FormProductRow[]>([
    { productId: '', name: '', quantity: 1, unitPrice: 0, discount: 0 },
  ]);

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Auto calculations
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Fetch DB Products to populate dropdown
  const fetchDbProducts = async () => {
    try {
      const response = await API.get('/products?status=Active');
      if (response.data.success) {
        setDbProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products for dropdown:', err);
    }
  };

  // Fetch invoice details if in edit mode
  const fetchInvoiceDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/invoices/${id}`);
      if (response.data.success) {
        const inv = response.data.data;
        setCustomerName(inv.customerName);
        setMobile(inv.mobile || '');
        setAddress(inv.address || '');
        setGstNumber(inv.gstNumber || '');
        setInvoiceDate(new Date(inv.invoiceDate).toISOString().substring(0, 10));
        setInvoiceNumber(inv.invoiceNumber);
        setGstPercentage(inv.gstPercentage);
        setStatus(inv.status);

        // Map products
        const mappedRows = inv.products.map((p: any) => ({
          productId: p.product?._id || p.product || 'custom',
          name: p.name,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          discount: p.discount,
        }));
        setProductRows(mappedRows);
      }
    } catch (err: any) {
      console.error('Error fetching invoice details:', err);
      setError(err.response?.data?.message || 'Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbProducts();
    if (isEditMode) {
      fetchInvoiceDetails();
    }
  }, [id]);

  // Calculate Subtotal, GST, Grand Total dynamically
  useEffect(() => {
    let tempSubtotal = 0;
    productRows.forEach((row) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.unitPrice) || 0;
      const disc = Number(row.discount) || 0;
      
      const lineTotal = (qty * price) - disc;
      tempSubtotal += Math.max(0, lineTotal);
    });

    const tempGstAmount = tempSubtotal * (gstPercentage / 100);
    const tempGrandTotal = tempSubtotal + tempGstAmount;

    setSubtotal(Math.round(tempSubtotal * 100) / 100);
    setGstAmount(Math.round(tempGstAmount * 100) / 100);
    setGrandTotal(Math.round(tempGrandTotal * 100) / 100);
  }, [productRows, gstPercentage]);

  // Handle dropdown product selection
  const handleProductSelect = (index: number, selectedId: string) => {
    const updatedRows = [...productRows];
    
    if (selectedId === 'custom') {
      updatedRows[index] = {
        productId: 'custom',
        name: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
      };
    } else {
      const selectedProduct = dbProducts.find((p) => p._id === selectedId);
      if (selectedProduct) {
        // Look up price from product specifications (e.g. search key for Price/MRP/Rate)
        let rate = 0;
        const priceSpec = selectedProduct.specifications.find((s) =>
          /price|mrp|rate/i.test(s.key)
        );
        if (priceSpec) {
          const parsed = parseFloat(priceSpec.value.replace(/[^0-9.]/g, ''));
          if (!isNaN(parsed)) {
            rate = parsed;
          }
        }

        updatedRows[index] = {
          productId: selectedProduct._id,
          name: selectedProduct.name,
          quantity: 1,
          unitPrice: rate,
          discount: 0,
        };
      }
    }
    setProductRows(updatedRows);
  };

  const handleRowChange = (index: number, field: keyof FormProductRow, value: any) => {
    const updatedRows = [...productRows];
    
    if (field === 'quantity') {
      updatedRows[index].quantity = Math.max(1, parseInt(value) || 1);
    } else if (field === 'unitPrice') {
      updatedRows[index].unitPrice = Math.max(0, parseFloat(value) || 0);
    } else if (field === 'discount') {
      updatedRows[index].discount = Math.max(0, parseFloat(value) || 0);
    } else if (field === 'name') {
      updatedRows[index].name = value;
    }

    setProductRows(updatedRows);
  };

  const addProductRow = () => {
    setProductRows([
      ...productRows,
      { productId: '', name: '', quantity: 1, unitPrice: 0, discount: 0 },
    ]);
  };

  const removeProductRow = (index: number) => {
    if (productRows.length === 1) {
      alert('An invoice must contain at least one item.');
      return;
    }
    const updatedRows = productRows.filter((_, i) => i !== index);
    setProductRows(updatedRows);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!customerName.trim()) {
      setError('Customer name is required.');
      return;
    }

    // Verify product rows are not empty
    const invalidRow = productRows.find((row) => !row.name.trim());
    if (invalidRow) {
      setError('All product item rows must have a valid product name.');
      return;
    }

    setSaving(true);

    // Format products payload
    const productsPayload = productRows.map((row) => ({
      product: row.productId && row.productId !== 'custom' ? row.productId : undefined,
      name: row.name,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      discount: row.discount,
    }));

    const invoiceData = {
      customerName,
      mobile: mobile || undefined,
      address: address || undefined,
      gstNumber: gstNumber || undefined,
      invoiceDate: new Date(invoiceDate),
      products: productsPayload,
      gstPercentage,
      status,
    };

    try {
      let response;
      if (isEditMode) {
        response = await API.put(`/invoices/${id}`, invoiceData);
      } else {
        response = await API.post('/invoices', invoiceData);
      }

      if (response.data.success) {
        navigate('/admin/invoices');
      } else {
        setError(response.data.message || 'Failed to save invoice.');
      }
    } catch (err: any) {
      console.error('Submit invoice error:', err);
      setError(err.response?.data?.message || 'Error occurred while saving.');
    } finally {
      setSaving(false);
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-5">
          <Link
            to="/admin/invoices"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-250 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-display">
              {isEditMode ? `Edit Invoice: ${invoiceNumber}` : 'Create Invoice'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditMode
                ? 'Update billing items, modify customer information, or set new payment statuses.'
                : 'Configure a new invoice, specify line items, and automatically compute taxes.'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Customer details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <h3 className="font-display font-bold text-gray-900 text-sm uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-brand" />
                    <span>Customer Details</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. John Doe / Alpha Lighting Corp"
                        className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        GST Number
                      </label>
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        placeholder="e.g. 24AAAAB1111C1Z1"
                        className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Invoice Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Billing Address
                    </label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter billing/delivery address details..."
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700"
                    />
                  </div>
                </div>

                {/* Products Table/Row Form */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-display font-bold text-gray-900 text-sm uppercase flex items-center gap-2">
                      <Receipt className="h-4.5 w-4.5 text-brand" />
                      <span>Line Items (Products)</span>
                    </h3>
                    <button
                      type="button"
                      onClick={addProductRow}
                      className="flex items-center gap-1 text-[11px] font-bold text-brand hover:text-brand-hover hover:underline cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Item Row</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {productRows.map((row, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row gap-3 items-end bg-[#FAF9F6] p-4 rounded-2xl border border-gray-150"
                      >
                        {/* Product selection */}
                        <div className="w-full md:w-1/4">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Choose Product *
                          </label>
                          <select
                            value={row.productId}
                            required
                            onChange={(e) => handleProductSelect(index, e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700"
                          >
                            <option value="" disabled>-- Select Product --</option>
                            {dbProducts.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name}
                              </option>
                            ))}
                            <option value="custom">-- Custom / Manual Entry --</option>
                          </select>
                        </div>

                        {/* Custom name input */}
                        <div className="w-full md:w-1/4">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Description Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={row.name}
                            disabled={row.productId !== 'custom' && row.productId !== ''}
                            onChange={(e) => handleRowChange(index, 'name', e.target.value)}
                            placeholder="Product name/model"
                            className="w-full rounded-xl border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-brand focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 font-semibold text-gray-700"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="w-20">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-mono text-center font-bold text-gray-700"
                          />
                        </div>

                        {/* Unit price */}
                        <div className="w-full md:w-32">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Price (INR)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={row.unitPrice}
                            onChange={(e) => handleRowChange(index, 'unitPrice', e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-mono text-right font-bold text-gray-700"
                          />
                        </div>

                        {/* Discount */}
                        <div className="w-full md:w-28">
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Discount
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={row.discount}
                            onChange={(e) => handleRowChange(index, 'discount', e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-xl border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-mono text-right text-gray-700"
                          />
                        </div>

                        {/* Remove item row */}
                        <button
                          type="button"
                          onClick={() => removeProductRow(index)}
                          className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-white border border-gray-250 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0 cursor-pointer mb-[1px]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Calculations & Controls */}
              <div className="space-y-6">
                {/* General Invoice Settings */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <h3 className="font-display font-bold text-gray-900 text-sm uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
                    <Save className="h-4.5 w-4.5 text-brand" />
                    <span>Controls</span>
                  </h3>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value={isEditMode ? invoiceNumber : 'INV-xxxxx (Auto Generate)'}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-mono font-bold tracking-wider text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Invoice Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-[#FAF9F6] border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-bold text-gray-750"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center justify-between">
                      <span>GST Rate (%)</span>
                      <span className="flex items-center text-brand">
                        <Percent className="h-3 w-3" />
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gstPercentage}
                      onChange={(e) => setGstPercentage(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs font-bold text-gray-700"
                    />
                  </div>
                </div>

                {/* live display math total calculations */}
                <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-md border border-gray-800 space-y-4">
                  <h3 className="font-display font-bold text-sm uppercase border-b border-gray-800 pb-3 text-gray-400 tracking-wider">
                    Invoice Calculations
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="font-mono font-bold">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between font-medium">
                      <span className="text-gray-400">GST ({gstPercentage}%):</span>
                      <span className="font-mono font-bold">{formatPrice(gstAmount)}</span>
                    </div>

                    <div className="border-t border-gray-800 pt-3 flex justify-between items-baseline">
                      <span className="font-display text-sm font-bold text-gray-300">Grand Total:</span>
                      <span className="font-display text-xl font-black text-brand tracking-tight font-mono">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800 flex flex-col gap-2 font-display text-xs font-bold uppercase tracking-wider">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full rounded-full bg-brand py-3 text-white hover:bg-brand-hover disabled:bg-gray-500 shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4.5 w-4.5" />
                      <span>{saving ? 'Saving...' : 'Save Invoice'}</span>
                    </button>
                    <Link
                      to="/admin/invoices"
                      className="w-full rounded-full border border-gray-800 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-center"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default InvoiceForm;
