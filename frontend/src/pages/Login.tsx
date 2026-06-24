import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { LogIn, UserPlus, Info, CheckCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If already authenticated, redirect to dashboards immediately
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (isLogin) {
      if (!email || !password) {
        setError('Please fill in all fields.');
        setSubmitting(false);
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in name, email, and password.');
        setSubmitting(false);
        return;
      }
      const res = await register({ name, email, password, phone, companyName });
      if (res.success) {
        setSuccess('Registration successful! Logging in...');
        setTimeout(() => {
          if (res.user.role === 'Admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }, 1500);
      } else {
        setError(res.message);
      }
    }
    setSubmitting(false);
  };

  // Helper to prefill details for immediate testing
  const handleQuickLogin = async (role: 'Admin' | 'User') => {
    setError('');
    setSubmitting(true);
    const demoEmail = role === 'Admin' ? 'admin@rentalite.com' : 'user@rentalite.com';
    const demoPass = role === 'Admin' ? 'adminpassword' : 'userpassword';

    setEmail(demoEmail);
    setPassword(demoPass);

    const res = await login(demoEmail, demoPass);
    if (!res.success) {
      setError(res.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 flex items-center justify-center">
      <div className="mx-auto max-w-md w-full px-4">

        {/* Card Box */}
        <div className="bg-white rounded-3xl p-8 border border-gray-150 shadow-sm flex flex-col gap-6">
          <div className="text-center">
            <span className="font-display text-2xl font-extrabold tracking-tight text-gray-900">
              RentaLite<span className="text-brand">.</span>
            </span>
            <h2 className="text-xl font-bold text-gray-800 mt-2">
              {isLogin ? 'Access Partner Portal' : 'Register Partner Account'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isLogin ? 'Enter your credentials to view dashboard panels.' : 'Onboard as a dealer to register inquiries.'}
            </p>
          </div>

          {/* Quick Demo Credentials Panel */}
          {/* {isLogin && (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <div className="flex items-start gap-2.5 text-amber-800 text-[11px] font-semibold">
                <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900">Portfolio Demo Access:</span> <br />
                  Log in directly without seeding by clicking a shortcut profile card:
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Admin')}
                  className="rounded-xl border border-amber-300 bg-white hover:bg-amber-50 px-3 py-2 text-center text-[10px] font-bold text-amber-900 transition-colors shadow-xs"
                >
                  Demo Admin Profile
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('User')}
                  className="rounded-xl border border-amber-300 bg-white hover:bg-amber-50 px-3 py-2 text-center text-[10px] font-bold text-amber-900 transition-colors shadow-xs"
                >
                  Demo User Profile
                </button>
              </div>
            </div>
          )} */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-xs font-bold text-brand">{error}</div>}
            {success && (
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                <span>{success}</span>
              </div>
            )}

            {!isLogin && (
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
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
              />
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
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
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md transition-colors disabled:bg-gray-400 cursor-pointer"
              >
                {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                <span>{submitting ? 'Authenticating...' : isLogin ? 'Log In' : 'Register Partner'}</span>
              </button>
            </div>
          </form>

          {/* Toggle */}
          <div className="text-center pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-400">
              {isLogin ? "Don't have a partner account? " : 'Already registered? '}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-brand font-bold hover:underline ml-1"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
