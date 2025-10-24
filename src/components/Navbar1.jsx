import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import logo from '../images/logo.png';

import {
  Menu,
  X,
  Home,
  Package,
  Users,
  Monitor,
  CalendarClock,
  IdCard,
  IndianRupee,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const cx = (...arr) => arr.filter(Boolean).join(' ');

// Tooltip for compact mode
const Tooltip = ({ label }) => (
  <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
    {label}
  </span>
);

// Helper (NOT a hook) -> safe across early returns
function getNavigationItems(role) {
  if (role === 'admin') {
    return [
      { name: 'Dashboard', path: '/admin', icon: Home },
      { name: 'Service', path: '/admin/products', icon: Package },
      { name: 'Branches', path: '/admin/branches', icon: Users },
      { name: 'Staff', path: '/admin/staff', icon: Users },
      { name: 'MemberShip', path: '/admin/membership', icon: Package },
      { name: 'Add MemberShip', path: '/admin/purchase', icon: IdCard },
      { name: 'Therapist-Availability', path: '/admin/therapist-availability', icon: CalendarClock },
      { name: 'Transactions', path: '/admin/transactions', icon: IndianRupee },
    ];
  }
  if (role === 'manager') {
    return [
      { name: 'Dashboard', path: '/manager', icon: Home },
      { name: 'Service', path: '/manager/products', icon: Package },
      { name: 'Staff', path: '/manager/staff', icon: Users },
      { name: 'MemberShip', path: '/manager/membership', icon: Package },
      { name: 'Add MemberShip', path: '/manager/purchase', icon: IdCard },
      { name: 'Billing', path: '/manager/billing', icon: Monitor },
      { name: 'Therapist-Availability', path: '/manager/therapist-availability', icon: CalendarClock },
      { name: 'Transactions', path: '/manager/transactions', icon: IndianRupee },
    ];
  }
  if (role === 'pos') {
    return [
      { name: 'Dashboard', path: '/pos', icon: Home },
      { name: 'Billing', path: '/pos/billing', icon: ShoppingCart },
    ];
  }
  return [];
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [compact, setCompact] = useState(false); // desktop rail collapse

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hide on login or when no user
  if (location.pathname === '/login' || !user) return null;

  const navigationItems = getNavigationItems(user.role);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {settings?.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {settings?.companyName || 'Ody Spa System'}
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      <div className="h-16 lg:hidden" />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar (mobile drawer + desktop rail) */}
      <div
        className={cx(
          // base container
          'fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg',
          'transform transition-all duration-300 ease-in-out overflow-visible',

          // MOBILE/TABLET: slide in/out
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',

          // DESKTOP: always visible
          'lg:translate-x-0',

          // widths
          'w-64', // default (mobile/tablet)
          compact ? 'lg:w-16' : 'lg:w-64' // desktop compact/expanded
        )}
      >
        {/* Header with gradient + desktop collapse toggle */}
        <div
          className="relative flex items-center justify-between h-16 px-3 border-b border-gray-200 dark:border-gray-700"
          style={{ background: `linear-gradient(to right, ${settings?.primaryColor || '#8B5CF6'}, #3B82F6)` }}
        >
          {/* Branding */}
          {compact ? (
            // Compact: logo on top, name below
            <div className="flex flex-col items-center justify-center w-full">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-8 object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="mt-1 text-[10px] leading-none text-white font-semibold text-center truncate max-w-[3.8rem]">
                {settings?.companyName || 'Ody Spa Software'}
              </span>
            </div>
          ) : (
            // Expanded
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-8 object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-xl font-bold text-white">Ody Spa Software</h1>
            </div>
          )}

          {/* Desktop collapse/expand button */}
          <button
            onClick={() => setCompact((v) => !v)}
            className="hidden lg:inline-flex items-center justify-center p-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition absolute right-2"
            title={compact ? 'Expand' : 'Collapse'}
          >
            {compact ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cx(
                      'flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
                      isActive
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                      compact && 'justify-center px-3'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!compact && <span className="truncate">{item.name}</span>}
                  </Link>
                  {/* Hover name in compact mode */}
                  {compact && <Tooltip label={item.name} />}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom user card */}
        <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className={cx('flex items-center', compact ? 'justify-center' : 'justify-between')}>
            <div className="flex items-center gap-3 group relative">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-white" />
              </div>
              {!compact && (
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                </div>
              )}
              {/* Hover user name when compact */}
              {compact && <Tooltip label={`${user.name} • ${user.role}`} />}
            </div>

            {!compact && (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>

          {compact && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spacer to offset main content on desktop */}
      <div className={cx('hidden lg:block transition-[margin] duration-300', compact ? 'ml-16' : 'ml-64')} />
    </>
  );
};

export default Navbar;
