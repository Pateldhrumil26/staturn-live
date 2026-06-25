import React, { useEffect, useState } from 'react';

import API from '../services/api.js';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Layers, Lightbulb, ClipboardCopy, Mail, HeartHandshake, Compass, Users } from 'lucide-react';

import { AdminSidebar } from '../components/AdminSidebar.js';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    projects: 0,
    contacts: 0,
    dealers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catsRes, prodsRes, projsRes, contactsRes, dealersRes] = await Promise.all([
          API.get('/categories'),
          API.get('/products?status=Active'), // or fetch admin route
          API.get('/projects'),
          API.get('/contact'),
          API.get('/dealer'),
        ]);

        setStats({
          categories: catsRes.data.success ? catsRes.data.data.length : 0,
          products: prodsRes.data.success ? prodsRes.data.data.length : 0,
          projects: projsRes.data.success ? projsRes.data.data.length : 0,
          contacts: contactsRes.data.success ? contactsRes.data.data.length : 0,
          dealers: dealersRes.data.success ? dealersRes.data.data.length : 0,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Mock analytics history for the chart
  const analyticsData = [
    { month: 'Jan', Inquiries: 12, Dealers: 4 },
    { month: 'Feb', Inquiries: 18, Dealers: 8 },
    { month: 'Mar', Inquiries: 25, Dealers: 6 },
    { month: 'Apr', Inquiries: 38, Dealers: 11 },
    { month: 'May', Inquiries: 46, Dealers: 15 },
    { month: 'Jun', Inquiries: stats.contacts + 10, Dealers: stats.dealers + 3 },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-[#FAF9F6] min-h-screen">
      <AdminSidebar />

      {/* Main Admin Console Area */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-hidden">
        {/* Header */}
        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage lighting portfolios, categories, client inquiries, and dealer registrations.</p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Metrics grid cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Inquiries</div>
                <div className="font-display text-3xl font-extrabold text-gray-900 mt-2">{stats.contacts}</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dealer Applications</div>
                <div className="font-display text-3xl font-extrabold text-gray-900 mt-2">{stats.dealers}</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Products Catalog</div>
                <div className="font-display text-3xl font-extrabold text-gray-900 mt-2">{stats.products}</div>
              </div>
            </div>

            {/* Analytics chart panel */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-150 shadow-sm">
              <h3 className="font-display text-xs sm:text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 sm:mb-6 uppercase tracking-wide">
                Inquiry &amp; Dealer Trends (6 Months)
              </h3>
              <div className="h-48 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CA2827" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#CA2827" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                    <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Inquiries" stroke="#CA2827" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInq)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboard;
