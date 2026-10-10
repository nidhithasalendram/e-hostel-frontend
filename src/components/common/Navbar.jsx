import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'Administrator';
      case 'ROLE_WARDEN': return 'Hostel Warden';
      case 'ROLE_STUDENT': return 'Student';
      default: return role;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-2.5">
          <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">e-Hostel</h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide">MANAGEMENT SYSTEM</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200/80 rounded-full py-1.5 px-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left pr-1">
              <p className="text-xs font-semibold text-gray-900 leading-tight">{user.fullName}</p>
              <p className="text-[10px] text-gray-500 font-medium">{getRoleLabel(user.role)}</p>
            </div>
            <StatusBadge status={user.role ? user.role.replace('ROLE_', '') : ''} />
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center space-x-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
