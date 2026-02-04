import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdInventory, 
  MdShoppingCart, 
  MdEvent, 
  MdCategory, 
  MdSettings,
  MdPeople,
  MdMenu,
  MdClose,
  MdImage
} from 'react-icons/md';
import { MdLogout } from 'react-icons/md';
import { useAPP } from '../../contexts/AppContext';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: MdDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: MdPeople },
    { name: 'Manage Products', path: '/admin/products', icon: MdInventory },
    { name: 'Manage Orders', path: '/admin/orders', icon: MdShoppingCart },
    { name: 'Manage Events', path: '/admin/events', icon: MdEvent },
    { name: 'Manage Category', path: '/admin/categories', icon: MdCategory },
    { name: 'Hero Section', path: '/admin/hero-section', icon: MdImage },
    { name: 'Settings', path: '/admin/settings', icon: MdSettings },
  ];

  const isActive = (path) => location.pathname === path;

  const { logout } = useAPP();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isOpen ? (
          <MdClose className="w-6 h-6 text-gray-700" />
        ) : (
          <MdMenu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-64 bg-white h-screen shadow-xl border-r border-gray-100 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-0">
            <h1 className="text-2xl font-bold text-color-primary" style={{ fontFamily: 'Kaushan Script' }}>
              Meraity.ai
            </h1>
            <div className="h-8 w-8 -ml-1">
              <img src="/Images/logo.png" alt="Meraity.ai Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4 px-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="ml-3 font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        {/* Footer - Logout */}
        <div className="p-4 border-t bg-white flex-shrink-0">
          <button
            onClick={() => {
              try { logout(); } catch (e) { console.warn('logout error', e); }
              setIsOpen(false);
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <MdLogout className="w-5 h-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
