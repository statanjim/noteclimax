import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, AlertTriangle, ArrowRight, Database, KeyRound } from 'lucide-react';
import { ADMIN_EMAIL, checkIsAdminEmail } from '../lib/supabaseClient';

interface AdminLoginPageProps {
  onAdminLoginSuccess: (email: string) => void;
  onNavigate: (route: string) => void;
  onOpenSetupModal: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onAdminLoginSuccess,
  onNavigate,
  onOpenSetupModal,
}) => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const isAuthorized = checkIsAdminEmail(email);

    if (!isAuthorized) {
      setErrorMessage(`Access Denied: You are not authorized as admin. Only "${ADMIN_EMAIL}" can access the owner admin panel.`);
      return;
    }

    if (!password.trim()) {
      setErrorMessage('অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAdminLoginSuccess(email.trim());
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#0E6B4D] shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0E6B4D] text-[#FFB400] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Hind_Siliguri']">
            NoteClimax Admin — Owner Only
          </h1>
          <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 inline-block">
            🔒 ১০০% সিকিউর্ড ওনার অ্যাক্সেস প্যানেল
          </p>
        </div>

        {/* Security Warning Box */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>সতর্কবার্তা (Security Notice):</span>
          </p>
          <p className="text-[11px] leading-relaxed text-amber-800">
            শুধুমাত্র অনুমোদিত ওনার ইমেইল (<code>{ADMIN_EMAIL}</code>) পাসওয়ার্ড দিয়ে সাইন-ইন করে নোট যোগ বা পরিবর্তন করতে পারবেন।
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold space-y-1 animate-shake">
            <p className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </p>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              অ্যাডমিন ইমেইল (Owner Email) *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-[#0E6B4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              অ্যাডমিন পাসওয়ার্ড (Admin Password) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0E6B4D]"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Supabase Auth বা আপনার ওনার সিক্রেট পাসওয়ার্ড ব্যবহার করুন।
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>যাচাই করা হচ্ছে...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-[#FFB400]" />
                <span>অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-100 flex flex-col gap-2">
          <button
            onClick={onOpenSetupModal}
            className="text-xs font-semibold text-[#0E6B4D] hover:underline flex items-center justify-center gap-1"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase RLS & Schema কোয়েরি কপি করুন</span>
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            ← সাধারণ সাইটে ফিরে যান
          </button>
        </div>

      </div>
    </div>
  );
};
