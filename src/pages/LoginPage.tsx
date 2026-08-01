import React, { useState } from 'react';
import { User, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, fullName?: string) => void;
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email.trim(), fullName.trim() || undefined);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('student.google@gmail.com', 'Google Student User');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F5F0] text-[#0E6B4D] flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
            🎓
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-['Hind_Siliguri']">
            {isSignUp ? 'নতুন অ্যাকাউন্ট খুলুন' : 'শিক্ষার্থী লগইন (Student Login)'}
          </h1>
          <p className="text-xs text-slate-500">
            NoteClimax থেকে ফ্রি ও প্রিমিয়াম নোট সংগ্রহ করতে সাইন-ইন করুন।
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 border border-slate-300 rounded-xl font-semibold text-xs text-slate-700 bg-slate-50 hover:bg-white transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Google দিয়ে অবিরত থাকুন</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold absolute">অথবা ইমেইল</span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {isSignUp && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">আপনার পূর্ণ নাম *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. তানজিম আহমেদ"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0E6B4D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1">ইমেইল ঠিকানা (Email) *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0E6B4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">পাসওয়ার্ড (Password) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0E6B4D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'সাইন-আপ সম্পন্ন করুন' : 'লগইন করুন'}</span>
            <ArrowRight className="w-4 h-4 text-[#FFB400]" />
          </button>
        </form>

        {/* Toggle Signup/Login */}
        <div className="pt-2 text-center text-xs text-slate-600">
          {isSignUp ? (
            <p>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button onClick={() => setIsSignUp(false)} className="text-[#0E6B4D] font-bold hover:underline">
                লগইন করুন
              </button>
            </p>
          ) : (
            <p>
              নতুন অ্যাকাউন্ট নেই?{' '}
              <button onClick={() => setIsSignUp(true)} className="text-[#0E6B4D] font-bold hover:underline">
                এখানে ফ্রী অ্যাকাউন্ট খুলুন
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
