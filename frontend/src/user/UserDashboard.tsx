import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import API from '../services/api.js';
import { DealerInquiry } from '../types/index.js';
import { User, ClipboardList, CheckCircle, Clock, AlertTriangle, KeyRound } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [requests, setRequests] = useState<DealerInquiry[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Profile Edit form states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const response = await API.get('/dealer/my-requests');
        if (response.data.success) {
          setRequests(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user requests:', error);
      } finally {
        setLoadingRequests(false);
      }
    };

    if (user) {
      fetchMyRequests();
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (password && password !== confirmPassword) {
      setProfileError('Passwords do not match.');
      return;
    }

    setSubmittingProfile(true);
    const result = await updateProfile({
      name,
      phone,
      companyName,
      ...(password ? { password } : {}),
    });

    if (result.success) {
      setProfileSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setProfileError(result.message);
    }
    setSubmittingProfile(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            <CheckCircle className="h-3 w-3" />
            <span>Approved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
            <AlertTriangle className="h-3 w-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            <Clock className="h-3 w-3 animate-pulse" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Dashboard Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Partner Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-bold text-gray-800">{user?.name}</span>. Monitor your registered dealership requests and update credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Columns: submitted dealer applications */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                <ClipboardList className="h-5 w-5 text-brand" />
                <h2 className="font-display text-lg font-bold text-gray-800">Dealership Status Tracking</h2>
              </div>

              {loadingRequests ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No dealership applications submitted using this email profile. <br />
                  Submit an application from the "Become a Dealer" page to track status.
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req._id} className="p-4 rounded-2xl border border-gray-100 bg-[#FAF9F6] flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-display font-bold text-gray-900 text-sm">{req.companyName}</h4>
                          <span className="text-[10px] text-gray-400 font-medium">
                            Submitted: {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {getStatusBadge(req.status)}
                      </div>
                      
                      <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed bg-white p-2 rounded-lg border border-gray-100">
                        <span className="font-bold text-gray-500">Business Scope:</span> {req.businessType} • {req.message}
                      </div>

                      {req.adminNotes && (
                        <div className="text-xs text-brand bg-brand/5 border border-brand/10 p-2.5 rounded-xl">
                          <span className="font-bold">RentaLite Remarks:</span> {req.adminNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Columns: update user profile coordinates */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                <User className="h-5 w-5 text-brand" />
                <h2 className="font-display text-lg font-bold text-gray-800">Update Profile Details</h2>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {profileError && <div className="text-xs font-bold text-brand">{profileError}</div>}
                {profileSuccess && <div className="text-xs font-bold text-emerald-600">{profileSuccess}</div>}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email (Permanent)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Lumina Lights LLP"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password reset panel */}
                <div className="border-t border-gray-150 pt-4 mt-4 space-y-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold">
                    <KeyRound className="h-4 w-4 text-brand" />
                    <span>Change Portal Password</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">New Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submittingProfile}
                    className="w-full rounded-xl bg-brand py-2 text-xs font-bold text-white hover:bg-brand-hover shadow-md transition-colors disabled:bg-gray-400 cursor-pointer text-center"
                  >
                    {submittingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
