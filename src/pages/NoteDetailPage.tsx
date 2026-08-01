import React, { useState, useEffect } from 'react';
import { Book, Purchase } from '../types';
import { BkashPaymentModal } from '../components/BkashPaymentModal';
import { 
  Download, Lock, CheckCircle2, ShieldCheck, Eye, Clock, 
  BookOpen, Share2, Sparkles, User, ArrowLeft, FileText, Smartphone
} from 'lucide-react';

interface NoteDetailPageProps {
  slug: string;
  books: Book[];
  purchases: Purchase[];
  currentUser: { email: string; full_name?: string } | null;
  onNavigate: (route: string) => void;
  onRecordPurchase: (bookId: string, amount: number, trxId: string) => void;
  onIncrementViews: (bookId: string) => void;
}

export const NoteDetailPage: React.FC<NoteDetailPageProps> = ({
  slug,
  books,
  purchases,
  currentUser,
  onNavigate,
  onRecordPurchase,
  onIncrementViews,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  const book = books.find((b) => b.slug === slug);

  // Increment view count on mount
  useEffect(() => {
    if (book?.id) {
      onIncrementViews(book.id);
    }
  }, [book?.id]);

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-['Hind_Siliguri']">
          নোটটি খুঁজে পাওয়া যায়নি (Note Not Found)
        </h2>
        <p className="text-xs text-slate-500">
          আপনার অনুরোধকৃত নোটটি হয় মুছে ফেলা হয়েছে অথবা ভুল লিংক ব্যবহার করা হয়েছে।
        </p>
        <button
          onClick={() => onNavigate('/notes')}
          className="px-5 py-2.5 bg-[#0E6B4D] text-white font-bold rounded-xl text-xs"
        >
          ← সকল নোট তালিকায় ফিরে যান
        </button>
      </div>
    );
  }

  // Check if current user has purchased this premium note
  const isPurchased = purchases.some((p) => p.book_id === book.id);
  const canDownload = book.is_free || isPurchased;

  const handleDownloadClick = () => {
    if (!currentUser && book.is_free) {
      onNavigate('/login');
      return;
    }

    if (!canDownload) {
      setShowPaymentModal(true);
      return;
    }

    // Trigger PDF Download or opening in new window
    const targetUrl = book.pdf_url || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    window.open(targetUrl, '_blank');
    
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 4000);
  };

  const handlePaymentSuccess = (trxId: string, amount: number) => {
    onRecordPurchase(book.id, amount, trxId);
    setShowPaymentModal(false);
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate('/notes')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0E6B4D] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>সকল নোটে ফিরে যান</span>
      </button>

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#0E6B4D] text-white">
            {book.class_label}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-[#0E6B4D]">
            {book.subject}
          </span>
          {book.chapter && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
              {book.chapter}
            </span>
          )}
          {book.is_free ? (
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-white">
              ১০০% ফ্রি PDF
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FFB400] text-[#0E6B4D]">
              ৳{book.price} প্রিমিয়াম নোট
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-snug font-['Hind_Siliguri']">
          {book.title}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          {book.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-emerald-600" />
            {book.views || 0} বার পঠিত
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-amber-500" />
            প্রকাশকাল: {new Date(book.created_at).toLocaleDateString('bn-BD')}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#0E6B4D]" />
            NoteClimax Verified Note
          </span>
        </div>
      </div>

      {/* Sticky Section Pills Nav */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-2 border border-slate-200 shadow-md flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-700">
        <a href="#overview" className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#0E6B4D] whitespace-nowrap hover:bg-emerald-100">
          📌 সংক্ষিপ্ত তথ্য
        </a>
        <a href="#content" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 whitespace-nowrap">
          📖 মূল নোট পাঠ
        </a>
        <a href="#download" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 whitespace-nowrap">
          📥 ডাউনলোড কার্ড
        </a>
      </div>

      {/* Grid Layout: Main HTML Content + Sticky Sidebar Download Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content (prose styling) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          <div id="overview" className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-['Hind_Siliguri']">
              <BookOpen className="w-5 h-5 text-[#0E6B4D]" />
              অধ্যায় সারসংক্ষেপ ও নির্দেশিকা
            </h3>
          </div>

          {/* HTML Rendered Content with custom table styling */}
          <div 
            id="content"
            className="note-content text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 font-['Hind_Siliguri']"
            dangerouslySetInnerHTML={{ __html: book.content_html }}
          />

          <div className="pt-6 border-t border-slate-200 bg-emerald-50/50 p-4 rounded-2xl flex items-center justify-between">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-[#0E6B4D] block">NoteClimax Digital Quality:</span>
              পাঠ্যবইয়ের সাথে মিল রেখে প্রতি অধ্যায়ের পূর্ণাঙ্গ সমাধান।
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('নোটের লিংক কপি করা হয়েছে!');
              }}
              className="px-3 py-1.5 bg-white text-slate-700 rounded-lg text-xs font-bold border hover:bg-slate-50 flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              শেয়ার করুন
            </button>
          </div>

        </div>

        {/* Sticky Sidebar Download Card */}
        <div id="download" className="lg:col-span-1 sticky top-28 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border-2 border-[#0E6B4D] shadow-xl space-y-5">
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F5F0] text-[#0E6B4D] flex items-center justify-center mx-auto text-2xl font-bold">
                📄
              </div>
              <h3 className="font-bold text-slate-900 text-lg font-['Hind_Siliguri']">
                হ্যান্ডনোট PDF ডাউনলোড
              </h3>
              <p className="text-xs text-slate-500">
                মুদ্রণযোগ্য (Printable) ও ক্লিয়ার ফন্ট পিডিএফ।
              </p>
            </div>

            {/* Status Info Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>ধরন:</span>
                <span className="font-bold text-slate-800">{book.is_free ? 'ফ্রি নোট' : 'প্রিমিয়াম গাইড'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>মূল্য:</span>
                <span className="font-bold text-[#0E6B4D]">{book.is_free ? '৳০ (ফ্রি)' : `৳${book.price}`}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ফরম্যাট:</span>
                <span className="font-bold text-slate-800">HD PDF (Print Friendly)</span>
              </div>
            </div>

            {/* Action Buttons */}
            {canDownload ? (
              <div className="space-y-3">
                {isPurchased && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>আপনি এই প্রিমিয়াম নোটটি সফলভাবে ক্রয় করেছেন!</span>
                  </div>
                )}

                <button
                  onClick={handleDownloadClick}
                  className="w-full py-3.5 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#FFB400]" />
                  <span>PDF ডাউনলোড করুন (Download)</span>
                </button>
              </div>
            ) : !currentUser ? (
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('/login')}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>ডাউনলোড করতে লগইন করুন</span>
                </button>
                <p className="text-[11px] text-slate-500 text-center">
                  লগইন সম্পূর্ণ বিনামূল্যে এবং কয়েক সেকেন্ড সময় লাগে।
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3.5 bg-[#FFB400] hover:bg-amber-400 text-[#0E6B4D] font-black rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-102"
                >
                  <Smartphone className="w-4 h-4 text-[#0E6B4D]" />
                  <span>বিকাশ/নগদে নোটটি কিনুন (৳{book.price})</span>
                </button>
                <p className="text-[11px] text-slate-500 text-center">
                  ক্রয় করার সাথে সাথে আপনার অ্যাকাউন্ট লাইব্রেরিতে যুক্ত হবে।
                </p>
              </div>
            )}

            {downloadSuccessToast && (
              <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center animate-bounce">
                ✅ PDF ডাউনলোড শুরু হয়েছে!
              </div>
            )}

          </div>

          {/* Guarantee Badge */}
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-slate-700 text-center space-y-1">
            <span className="font-bold text-[#0E6B4D] block">১০০% কপিরাইট ও মান নিশ্চিতকরণ</span>
            <p className="text-slate-500">NoteClimax শিক্ষক প্যানেল দ্বারা পরীক্ষিত</p>
          </div>

        </div>

      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <BkashPaymentModal
          book={book}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
};
