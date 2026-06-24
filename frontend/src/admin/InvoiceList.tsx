import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { Invoice } from '../types/index.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Printer,
  Trash2,
  Receipt,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';

export const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Date Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // KPI summary stats
  const [stats, setStats] = useState({
    totalCount: 0,
    paidSum: 0,
    pendingSum: 0,
    cancelledCount: 0,
  });

  // Fetch metrics separately (without pagination/date filters to show absolute catalog totals)
  const fetchInvoiceMetrics = async () => {
    try {
      const response = await API.get('/invoices?limit=1000');
      if (response.data.success) {
        const all: Invoice[] = response.data.data;
        let paidSum = 0;
        let pendingSum = 0;
        let cancelledCount = 0;

        all.forEach((inv) => {
          if (inv.status === 'Paid') {
            paidSum += inv.grandTotal;
          } else if (inv.status === 'Pending') {
            pendingSum += inv.grandTotal;
          } else if (inv.status === 'Cancelled') {
            cancelledCount += 1;
          }
        });

        setStats({
          totalCount: all.length,
          paidSum,
          pendingSum,
          cancelledCount,
        });
      }
    } catch (err) {
      console.error('Error fetching invoice metrics:', err);
    }
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await API.get(`/invoices?${params.toString()}`);
      if (response.data.success) {
        setInvoices(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages || 1);
          setTotalCount(response.data.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceMetrics();
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm, statusFilter, startDate, endDate, page]);

  // Reset page to 1 when filters change
  const handleFilterChange = () => {
    setPage(1);
  };

  const handleDelete = async (id: string, invoiceNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      return;
    }
    try {
      const response = await API.delete(`/invoices/${id}`);
      if (response.data.success) {
        fetchInvoices();
        fetchInvoiceMetrics();
      }
    } catch (err) {
      console.error('Error deleting invoice:', err);
    }
  };

  // Download PDF blob from backend endpoint using axios and trigger save
  const handleDownloadPDF = async (id: string, invoiceNumber: string) => {
    try {
      const response = await API.get(`/invoices/${id}/pdf`, {
        responseType: 'blob', // crucial for binary data streams
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF from server:', err);
      alert('Failed to generate and download PDF from API.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-250">
            <CheckCircle className="h-3 w-3" />
            <span>Paid</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-250">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-250">
            <Clock className="h-3 w-3" />
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Invoices & Billing</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage customer billing accounts, verify tax structures, and export invoices.</p>
          </div>
          <Link
            to="/admin/invoices/new"
            className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md transition-all self-start cursor-pointer font-display"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Create Invoice</span>
          </Link>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Invoices</div>
              <div className="text-xl font-extrabold text-gray-900 font-display mt-0.5">{stats.totalCount}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Revenue Collected</div>
              <div className="text-xl font-extrabold text-emerald-600 font-display mt-0.5">{formatPrice(stats.paidSum)}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Outstanding Dues</div>
              <div className="text-xl font-extrabold text-amber-650 font-display mt-0.5">{formatPrice(stats.pendingSum)}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 border border-rose-100">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cancelled Orders</div>
              <div className="text-xl font-extrabold text-rose-600 font-display mt-0.5">{stats.cancelledCount}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs mb-6 space-y-4">
          <div className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">Filter and Search Settings</div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Search Input */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Search Parameters</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search invoice or customer..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange(); }}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 bg-[#FAF9F6] text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1 font-display">Invoice Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
                className="w-full bg-[#FAF9F6] border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700"
              >
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1 font-display">
                <Calendar className="h-3 w-3 text-brand" />
                <span>Start Date</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); handleFilterChange(); }}
                className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-1 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700 font-mono"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1 font-display">
                <Calendar className="h-3 w-3 text-brand" />
                <span>End Date</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); handleFilterChange(); }}
                className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-1 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-semibold text-gray-700 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Invoices List Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
            <p className="text-gray-500 text-sm">No invoices match these filter criteria. Try expanding search tags.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left">
                  <thead className="bg-[#FAF9F6] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-4">Invoice No</th>
                      <th scope="col" className="px-6 py-4">Customer</th>
                      <th scope="col" className="px-6 py-4">Date</th>
                      <th scope="col" className="px-6 py-4">Status</th>
                      <th scope="col" className="px-6 py-4 text-right">Grand Total</th>
                      <th scope="col" className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-xs font-semibold text-gray-700">
                    {invoices.map((inv) => (
                      <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-900 tracking-wider">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{inv.customerName}</span>
                            {inv.mobile && <span className="text-[10px] text-gray-400">{inv.mobile}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(inv.invoiceDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(inv.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-extrabold font-display">
                          {formatPrice(inv.grandTotal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* 1. View Invoice details */}
                            <Link
                              to={`/admin/invoices/${inv._id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                              title="View Invoice Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            {/* 2. Download PDF (Uses backend stream controller) */}
                            <button
                              onClick={() => handleDownloadPDF(inv._id, inv.invoiceNumber)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                              title="Download PDF"
                            >
                              <FileDown className="h-4 w-4" />
                            </button>

                            {/* 3. Print Invoice (Navigates to details and prompts print trigger) */}
                            <Link
                              to={`/admin/invoices/${inv._id}?print=true`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                              title="Print Invoice"
                            >
                              <Printer className="h-4 w-4" />
                            </Link>

                            {/* 4. Edit Invoice */}
                            <Link
                              to={`/admin/invoices/edit/${inv._id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Link>

                            {/* 5. Delete Invoice */}
                            <button
                              onClick={() => handleDelete(inv._id, inv.invoiceNumber)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls footer layout */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="text-xs text-gray-500 font-semibold">
                  Showing page <span className="text-gray-900 font-bold">{page}</span> of{' '}
                  <span className="text-gray-900 font-bold">{totalPages}</span> (Total {totalCount} records)
                </div>

                <div className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="flex items-center gap-1 rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageIdx = idx + 1;
                      return (
                        <button
                          key={pageIdx}
                          onClick={() => setPage(pageIdx)}
                          className={`h-8.5 w-8.5 rounded-xl border font-mono font-bold flex items-center justify-center transition-all ${
                            page === pageIdx
                              ? 'bg-brand text-white border-brand'
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageIdx}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="flex items-center gap-1 rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 transition-colors cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default InvoiceList;
