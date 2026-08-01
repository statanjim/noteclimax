import React, { useState } from 'react';
import { BookOpen, ShieldCheck, User, LogOut, LogIn, Menu, X, Sparkles, FolderDown } from 'lucide-react';
import { checkIsAdminEmail, ADMIN_EMAIL } from '../lib/supabaseClient';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  currentUser: { email: string; full_name?: string } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = checkIsAdminEmail(currentUser?.email);

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0E6B4D] text-white shadow-md border-b border-[#0A523B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFB400] text-[#0E6B4D] flex items-center justify-center font-bold text-xl shadow-md transform group-hover:scale-105 transition-all">
              NC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-2xl tracking-tight text-white font-['Hind_Siliguri']">
                  NoteClimax
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#FFB400] text-[#0E6B4D] rounded uppercase tracking-wide">
                  Class 6 - HSC
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 hidden sm:block">
                বাংলাদেশের বিশ্বস্ত অনলাইন নোট ও লার্নিং পোর্টাল
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNavClick('/')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentRoute === '/' 
                  ? 'bg-[#0A523B] text-white font-semibold' 
                  : 'text-emerald-50 hover:bg-[#0A523B]/60 hover:text-white'
              }`}
            >
              হোম (Home)
            </button>

            <button
              onClick={() => handleNavClick('/notes')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentRoute.startsWith('/notes') 
                  ? 'bg-[#0A523B] text-white font-semibold' 
                  : 'text-emerald-50 hover:bg-[#0A523B]/60 hover:text-white'
              }`}
            >
              নোটসমূহ (Notes)
            </button>

            <button
              onClick={() => handleNavClick('/dashboard')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute === '/dashboard' 
                  ? 'bg-[#0A523B] text-white font-semibold' 
                  : 'text-emerald-50 hover:bg-[#0A523B]/60 hover:text-white'
              }`}
            >
              <FolderDown className="w-4 h-4 text-[#FFB400]" />
              আমার লাইব্রেরি
            </button>

            {/* SECURED ADMIN BUTTON: Only visible if user is logged in & email strictly matches ADMIN_EMAIL */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('/admin')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                  currentRoute.startsWith('/admin')
                    ? 'bg-[#FFB400] text-[#0E6B4D]'
                    : 'bg-[#FFB400]/90 text-[#0E6B4D] hover:bg-[#FFB400] hover:scale-105'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#0E6B4D]" />
                <span>অ্যাডমিন প্যানেল</span>
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping"></span>
              </button>
            )}
          </nav>

          {/* Desktop Right Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-[#0A523B] px-3 py-1.5 rounded-xl border border-emerald-600/30">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-sm">
                  {currentUser.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight max-w-[140px] truncate">
                  <p className="text-xs font-semibold text-white truncate">
                    {currentUser.full_name || currentUser.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-emerald-200 truncate">
                    {isAdmin ? '👑 Owner Admin' : 'শিক্ষার্থী (Student)'}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  title="লগআউট"
                  className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-800 hover:bg-emerald-900 text-white transition-all flex items-center gap-1.5"
                >
                  <User className="w-4 h-4 text-emerald-300" />
                  লগইন
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-[#0A523B] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A523B] border-t border-emerald-700/50 px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNavClick('/')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-emerald-50 hover:bg-emerald-800"
          >
            হোম (Home)
          </button>
          <button
            onClick={() => handleNavClick('/notes')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-emerald-50 hover:bg-emerald-800"
          >
            নোটসমূহ (Notes)
          </button>
          <button
            onClick={() => handleNavClick('/dashboard')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-emerald-50 hover:bg-emerald-800 flex items-center gap-2"
          >
            <FolderDown className="w-4 h-4 text-[#FFB400]" />
            আমার লাইব্রেরি
          </button>

          {/* SECURED ADMIN LINK IN MOBILE */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-bold bg-[#FFB400] text-[#0E6B4D] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                অ্যাডমিন প্যানেল (Owner Admin)
              </span>
              <span className="text-xs bg-[#0E6B4D] text-white px-2 py-0.5 rounded">Active</span>
            </button>
          )}

          <div className="pt-3 border-t border-emerald-700">
            {currentUser ? (
              <div className="flex items-center justify-between bg-emerald-900/60 px-3 py-2.5 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-white">{currentUser.email}</p>
                  <p className="text-xs text-emerald-300">
                    {isAdmin ? '👑 Authorized Owner Admin' : 'Student Account'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="w-full py-2.5 bg-emerald-600 text-white text-center rounded-lg font-semibold"
                >
                  শিক্ষার্থী লগইন (Student Login)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
