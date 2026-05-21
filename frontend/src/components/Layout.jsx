import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, LogOut, Shield, User } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2.5">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">W</div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Workflow Hub</span>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold uppercase">
              {user?.name.slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate text-slate-900">{user?.name}</h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-0.5">
                <Shield className="h-2.5 w-2.5" />
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Main Dashboard
          </NavLink>
          {user?.role === 'User' && (
            <NavLink 
              to="/create-request" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <PlusCircle className="h-5 w-5" />
              New Submission
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Terminate Session
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <h2 className="font-semibold text-slate-800 text-sm">System Status: Operational</h2>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <User className="h-4 w-4" /> Node Node-01
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;