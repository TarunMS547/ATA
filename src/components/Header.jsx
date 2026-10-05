import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      <div className="flex-1 flex justify-end">
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <button type="button" className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <div className="relative flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:block">
              <span className="text-sm font-medium text-slate-700 block">{currentUser?.displayName || 'User'}</span>
              <span className="text-xs text-slate-500 block">{currentUser?.email}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200 text-primary-700">
              <User className="h-5 w-5" />
            </div>
            
            <button
              onClick={handleLogout}
              className="ml-2 flex items-center justify-center p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
