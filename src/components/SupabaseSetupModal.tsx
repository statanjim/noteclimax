import React, { useState } from 'react';
import { SUPABASE_SQL_SETUP, isSupabaseConfigured, ADMIN_EMAIL } from '../lib/supabaseClient';
import { X, Copy, Check, Database, ShieldCheck, ExternalLink, Terminal } from 'lucide-react';

interface SupabaseSetupModalProps {
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0E6B4D] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 rounded-xl">
              <Database className="w-5 h-5 text-[#FFB400]" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Supabase Database Setup & RLS Schema</h3>
              <p className="text-xs text-emerald-100">NoteClimax Table Structure & Security Policies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-[#0A523B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">Supabase সংযোগ অবস্থা (Status):</span>
              <span className={`text-sm font-bold flex items-center gap-1.5 ${isSupabaseConfigured ? 'text-emerald-700' : 'text-amber-600'}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                {isSupabaseConfigured ? 'Supabase Connected' : 'Preview Mode (Local Storage Fallback Active)'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">অনুমোদিত Admin Email:</span>
              <span className="text-xs font-mono font-bold text-[#0E6B4D]">{ADMIN_EMAIL}</span>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-slate-700 leading-relaxed space-y-2">
            <p className="font-bold text-[#0E6B4D] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FFB400]" />
              আপনার Supabase প্রজেক্টে এই Schema ইনস্টল করার নির্দেশিকা:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>নিচের SQL Script টি <strong>"Copy SQL Code"</strong> বাটনে ক্লিক করে কপি করুন।</li>
              <li>আপনার Supabase Dashboard এর <strong>SQL Editor</strong> ট্যাবে যান।</li>
              <li>নতুন কোয়েরিতে পেস্ট করে <strong>Run</strong> করুন।</li>
              <li><code>VITE_SUPABASE_URL</code> এবং <code>VITE_SUPABASE_ANON_KEY</code> আপনার <code>.env</code> এ সেট করুন।</li>
            </ol>
          </div>

          {/* SQL Code Block */}
          <div className="relative">
            <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 rounded-t-xl text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                schema_setup.sql
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে!' : 'Copy SQL Code'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 text-emerald-300 p-4 rounded-b-xl text-xs font-mono overflow-x-auto max-h-64 leading-relaxed border-x border-b border-slate-800">
              {SUPABASE_SQL_SETUP}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-semibold text-sm rounded-xl"
          >
            বন্ধ করুন (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
