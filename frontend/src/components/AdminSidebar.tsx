import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import {
  Layers, Lightbulb, ClipboardCopy, Mail, Compass,
  LogOut, LayoutDashboard, Receipt, Menu, X, ChevronRight,
} from 'lucide-react';

const adminMenu = [
  { path: '/admin/dashboard', label: 'Console Home', icon: LayoutDashboard },
  { path: '/admin/categories', label: 'Categories Manager', icon: Layers },
  { path: '/admin/products', label: 'Products Manager', icon: Lightbulb },
  { path: '/admin/projects', label: 'Projects Gallery', icon: ClipboardCopy },
  { path: '/admin/inquiries', label: 'Inquiries Desk', icon: Mail },
  { path: '/admin/invoices', label: 'Invoices & Billing', icon: Receipt },
];

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <aside
      className="flex flex-col justify-between h-full bg-gray-900 text-gray-400"
      style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Top: Brand + Nav */}
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-800 flex items-center justify-between">
          <Link to="/" className="flex flex-col gap-0.5" onClick={() => setMobileOpen(false)}>
            <span className="font-display text-lg font-extrabold tracking-tight text-white leading-none">
              RentaLite Admin<span className="text-brand">.</span>
            </span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Control Panel</span>
          </Link>
          {/* Close button — mobile only */}
          <button
            className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Active page label pill — mobile only */}
        <div className="md:hidden px-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Navigation</div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 px-3">
          {adminMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-brand text-white font-bold shadow-lg shadow-brand/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer: View Site + Logout */}
      <div className="px-3 pb-5 flex flex-col gap-1 border-t border-gray-800 pt-4">
        {/* User info pill */}
        {user && (
          <div className="mb-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8">
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Logged in as</div>
            <div className="font-display font-bold text-white text-xs truncate mt-0.5">{user.name}</div>
            <div className="text-[9px] text-brand font-bold uppercase mt-0.5">{user.role}</div>
          </div>
        )}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          onClick={() => setMobileOpen(false)}
        >
          <Compass className="h-4 w-4 text-brand shrink-0" />
          <span>View Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all text-left w-full cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── MOBILE: Top bar with hamburger ── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(17,24,39,0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
          height: '56px',
        }}
      >
        <Link to="/" className="flex items-center gap-1.5">
          <span className="font-display text-base font-extrabold tracking-tight text-white">
            RentaLite<span className="text-brand">.</span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 self-end mb-0.5">Admin</span>
        </Link>

        {/* Current page breadcrumb */}
        <span className="text-xs font-semibold text-gray-400 truncate max-w-[120px]">
          {adminMenu.find(m => location.pathname.startsWith(m.path))?.label ?? 'Admin'}
        </span>

        <button
          className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── MOBILE: Backdrop overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE: Slide-in drawer ── */}
      <div
        className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 transition-transform duration-300 ease-out"
        style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        aria-label="Admin navigation drawer"
      >
        <SidebarContent />
      </div>

      {/* ── DESKTOP: Standard fixed sidebar ── */}
      <div className="hidden md:flex w-64 min-h-screen flex-col shrink-0">
        <SidebarContent />
      </div>

      {/* ── MOBILE: Top bar spacer so content isn't hidden under the bar ── */}
      <div className="md:hidden h-14 shrink-0 w-full" />
    </>
  );
};

export default AdminSidebar;
