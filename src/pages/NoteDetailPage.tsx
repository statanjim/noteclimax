import React, { useState, useEffect } from 'react';
import { Book, Purchase } from '../types';
import { BkashPaymentModal } from '../components/BkashPaymentModal';
import { Download, Eye, Clock, ShieldCheck, BookOpen, Share2, User, ArrowLeft, FileText, Smartphone, CheckCircle2 } from 'lucide-react';

interface NoteDetailPageProps {
  slug: string; books: Book[]; purchases: Purchase[];
  currentUser: { email: string; full_name?: string } | null;
  onNavigate: (route: string) => void;
  onRecordPurchase: (bookId: string, amount: number, trxId: string) => void;
  onIncrementViews: (bookId: string) => void;
}

export const NoteDetailPage: React.FC<NoteDetailPageProps> = ({ slug, books, purchases, currentUser, onNavigate, onRecordPurchase, onIncrementViews }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const book = books.find((b) => b.slug === slug) as any;
  useEffect(() => { if (book?.id) onIncrementViews(book.id); }, [book?.id]);
  if (!book) return <div className="p-16 text-center">নোট পাওয়া যায়নি</div>;
  const isPurchased = purchases.some((p) => p.book_id === book.id);
  const canDownload = book.is_free || isPurchased;

  let previewImages: string[] = [];
  try { if (book.preview_images) { const parsed = typeof book.preview_images === 'string'? JSON.parse(book.preview_images) : book.preview_images; if (Array.isArray(parsed)) previewImages = parsed; } } catch { if (typeof book.preview_images === 'string' && book.preview_images.startsWith('http')) previewImages = [book.preview_images]; }

  const handleDownload = () => {
    if (!currentUser && book.is_free) { onNavigate('/login'); return; }
    if (!canDownload) { setShowPaymentModal(true); return; }
    window.open(book.pdf_url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button onClick={() => onNavigate('/notes')} className="inline-flex items-center gap-1.5 text-xs font-bold bg-white px-3.5 py-2 rounded-xl border"><ArrowLeft className="w-4 h-4" /> সকল নোটে ফিরে যান</button>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2"><span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#0E6B4D] text-white">{book.class_label}</span><span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-[#0E6B4D]">{book.subject}</span>{book.is_free? <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-white">ফ্রি</span> : <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FFB400] text-[#0E6B4D]">৳{book.price}</span>}</div>
        <h1 className="text-3xl font-black">{book.title}</h1><p className="text-sm text-slate-600">{book.description}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {previewImages.length > 0? (
            <div id="pdf-preview" className="bg-white rounded-3xl border-2 border-dashed border-emerald-200 p-4 space-y-3 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 text-sm"><FileText className="w-5 h-5 text-[#0E6B4D]" /> ভেতরে কি আছে? (৩ পেজ Preview)</h3>
              <div className="space-y-4 relative">
                {previewImages.slice(0,3).map((img, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border shadow-lg"><img src={img} className="w-full h-auto" /><span className="absolute top-2 left-2 bg-black/70 text-white text- px-2 py-0.5 rounded-full">Page {idx+1}</span>{idx===2 && <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-2"><span className="bg-slate-900 text-white text-xs px-4 py-1.5 rounded-full">Preview শেষ</span></div>}</div>
                ))}
              </div>
              <button onClick={handleDownload} className="w-full py-3 bg-[#0E6B4D] text-white font-bold rounded-xl flex justify-center gap-2"><Download className="w-4 h-4" /> সম্পূর্ণ PDF ডাউনলোড করুন</button>
            </div>
          ) : book.pdf_url? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-emerald-200 p-4 space-y-3"><h3 className="font-bold text-sm flex gap-2"><FileText className="w-4 h-4" /> PDF Preview</h3><div className="h- rounded-xl overflow-hidden border"><iframe src={`${book.pdf_url}#toolbar=0`} className="w-full h-full" /></div></div>
          ) : null}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border shadow-sm"><h3 className="font-bold mb-4 flex gap-2"><BookOpen className="w-5 h-5 text-[#0E6B4D]" /> মূল নোট কন্টেন্ট</h3><div className="note-content text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: book.content_html }} /></div>
        </div>
        <div className="lg:col-span-1 sticky top-28 bg-white rounded-3xl p-6 border-2 border-[#0E6B4D] shadow-xl text-center space-y-4"><h3 className="font-bold">হ্যান্ডনোট PDF ডাউনলোড</h3><button onClick={handleDownload} className="w-full py-3.5 bg-[#0E6B4D] text-white font-bold rounded-xl">{canDownload? 'PDF ডাউনলোড করুন' : `বিকাশে কিনুন ৳${book.price}`}</button></div>
      </div>
      {showPaymentModal && <BkashPaymentModal book={book} onClose={() => setShowPaymentModal(false)} onSuccess={(trxId, amount) => { onRecordPurchase(book.id, amount, trxId); setShowPaymentModal(false); }} />}
    </div>
  );
};
