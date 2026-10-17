import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/plants', label: 'Plants Registry', icon: 'psychiatry' },
    { path: '/iot-simulator', label: 'IoT Simulator', icon: 'developer_board' },
    { path: '/ai-chat', label: 'AI Assistant', icon: 'chat' },
    { path: '/image-analysis', label: 'Image Analysis', icon: 'image' },
    { path: '/knowledge-base', label: 'Knowledge Base', icon: 'database' },
    ...(!isAuthenticated ? [{ path: '/auth', label: 'Sign In', icon: 'lock' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm shadow-emerald-500/20">
            <span className="material-symbols-outlined text-sm">eco</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">AeroSense</span>
        </Link>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
        {isAuthenticated && (
          <LogoutButton
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-error transition-all"
            title="Logout"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span className="hidden md:inline">Logout</span>
          </LogoutButton>
        )}
      </div>
    </nav>
  );
}
