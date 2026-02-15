import { Key, LogOut, Settings, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export function Header() {
  const { isAdmin, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-lg font-bold text-white">HT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">HT1-HT3 Settings</h1>
                <p className="text-xs text-gray-400">Premium PvP Packs</p>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden md:inline">Admin Panel</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  <span className="hidden md:inline">Admin Login</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}

      {showAdminPanel && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-gray-900 border-l border-white/10 overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-6">
              <AdminDashboard />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
