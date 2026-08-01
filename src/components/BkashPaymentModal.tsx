import React, { useState } from 'react';
import { Book } from '../types';
import { X, CheckCircle2, ShieldCheck, Smartphone, Copy, Sparkles, CreditCard } from 'lucide-react';

interface BkashPaymentModalProps {
  book: Book;
  onClose: () => void;
  onSuccess: (trxId: string, amount: number) => void;
}

export const BkashPaymentModal: React.FC<BkashPaymentModalProps> = ({
  book,
  onClose,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const [phone, setPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const merchantNumber = method === 'bkash' ? '01700-123456' : '01800-654321';

  const handleCopy = () => {
    navigator.clipboard.writeText(merchantNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (method !== 'card' && !trxId.trim()) {
      setError('অনুগ্রহ করে ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedTrx = trxId.trim().toUpperCase() || `TRX${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      onSuccess(generatedTrx, book.price);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-100">
        
        {/* Modal Header */}
        <div className="bg-[#0E6B4D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFB400] text-[#0E6B4D] font-bold flex items-center justify-center">
              ৳
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">প্রিমিয়াম নোট ক্রয়</h3>
              <p className="text-xs text-emerald-100">NoteClimax Instant Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-[#0A523B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note Summary */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">নির্বাচিত নোট:</p>
            <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{book.title}</h4>
            <span className="text-xs font-semibold text-[#0E6B4D]">{book.class_label}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">মূল্য:</span>
            <span className="text-xl font-black text-[#0E6B4D]">৳{book.price}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-5 space-y-4">
          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
            পেমেন্ট মাধ্যম নির্বাচন করুন:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setMethod('bkash')}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                method === 'bkash'
                  ? 'border-[#0E6B4D] bg-[#E6F5F0] text-[#0E6B4D] ring-2 ring-[#0E6B4D]/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-4 h-4 text-pink-600" />
              <span>bKash (বিকাশ)</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('nagad')}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                method === 'nagad'
                  ? 'border-[#0E6B4D] bg-[#E6F5F0] text-[#0E6B4D] ring-2 ring-[#0E6B4D]/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-4 h-4 text-orange-600" />
              <span>Nagad (নগদ)</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                method === 'card'
                  ? 'border-[#0E6B4D] bg-[#E6F5F0] text-[#0E6B4D] ring-2 ring-[#0E6B4D]/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Card / Quick</span>
            </button>
          </div>

          {method !== 'card' ? (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">মার্চেন্ট Personal নাম্বার:</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800 bg-white px-2 py-1 rounded border">
                  <span>{merchantNumber}</span>
                  <button onClick={handleCopy} className="text-[#0E6B4D] hover:underline">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                ১. আপনার {method === 'bkash' ? 'বিকাশ' : 'নগদ'} অ্যাপ থেকে Send Money / Merchant অপশনে <strong>৳{book.price}</strong> পাঠাও।<br/>
                ২. সফল ট্রানজেকশনের পর TrxID নিচে লিখুন।
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 p-3 rounded-xl text-xs text-emerald-800 border border-emerald-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFB400] shrink-0" />
              <span>ডেমো মোড: তাত্ক্ষণিক অ্যাক্সেসের জন্য "পেমেন্ট নিশ্চিত করুন" বাটনে ক্লিক করুন!</span>
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {method !== 'card' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ট্রানজেকশন আইডি (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9J47K2L8M"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#0E6B4D] focus:border-[#0E6B4D] uppercase"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>পেমেন্ট ভেরিফাই করা হচ্ছে...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#FFB400]" />
                  <span>পেমেন্ট নিশ্চিত করুন (৳{book.price})</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
