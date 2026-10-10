import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  BedDouble, 
  DollarSign, 
  MessageSquareWarning, 
  UserCheck, 
  User, 
  FileText,
  DoorOpen
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role;

  const adminNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Hostels & Rooms', path: '/admin/rooms', icon: Building },
    { name: 'Room Allocations', path: '/admin/allocations', icon: BedDouble },
    { name: 'Fee Management', path: '/admin/fees', icon: DollarSign },
    { name: 'Complaints', path: '/admin/complaints', icon: MessageSquareWarning },
  ];

  const wardenNav = [
    { name: 'Overview', path: '/warden/dashboard', icon: LayoutDashboard },
    { name: 'Room Allocation', path: '/warden/rooms', icon: BedDouble },
    { name: 'Complaints', path: '/warden/complaints', icon: MessageSquareWarning },
    { name: 'Visitor Log', path: '/warden/visitors', icon: UserCheck },
  ];

  const studentNav = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Room', path: '/student/room', icon: DoorOpen },
    { name: 'My Fees', path: '/student/fees', icon: DollarSign },
    { name: 'Complaints', path: '/student/complaints', icon: MessageSquareWarning },
    { name: 'My Visitors', path: '/student/visitors', icon: UserCheck },
    { name: 'My Profile', path: '/student/profile', icon: User },
  ];

  let navItems = studentNav;
  if (role === 'ROLE_ADMIN') navItems = adminNav;
  if (role === 'ROLE_WARDEN') navItems = wardenNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-slate-900 text-slate-300 border-r border-slate-800
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-200 ease-in-out flex flex-col justify-between
      `}>
        <div className="p-4">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            Navigation Menu
          </div>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>System Status</span>
            <span className="inline-flex items-center text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
