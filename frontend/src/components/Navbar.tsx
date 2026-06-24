import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/categories', label: 'Categories' },
    { path: '/products', label: 'Products' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/become-dealer', label: 'Become a Dealer' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-[#F2F2F2]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold tracking-tight text-gray-900">
                Staturn light<span className="text-brand">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-display text-sm font-semibold tracking-wide transition-colors duration-200 hover:text-brand ${
                    isActive ? 'text-brand border-b-2 border-brand pb-1' : 'text-gray-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Panel */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard'}
                  className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm border border-gray-200 transition-all hover:bg-gray-50"
                >
                  {user.role === 'Admin' ? (
                    <LayoutDashboard className="h-4 w-4 text-brand" />
                  ) : (
                    <Compass className="h-4 w-4 text-brand" />
                  )}
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white transition-all hover:bg-brand-hover shadow-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-black shadow-md hover:shadow-lg"
              >
                <UserIcon className="h-4 w-4" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-brand focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-brand'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            {/* User Session Actions */}
            <div className="border-t border-gray-100 pt-4 mt-4 px-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-semibold text-gray-400 mb-1">
                    Logged in as: <span className="text-gray-700 font-bold">{user.name}</span> ({user.role})
                  </div>
                  <Link
                    to={user.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 py-2.5 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-200"
                  >
                    {user.role === 'Admin' ? <LayoutDashboard className="h-4 w-4" /> : <Compass className="h-4 w-4" />}
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 py-2.5 text-sm font-bold text-white transition-colors hover:bg-black"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Portal Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
