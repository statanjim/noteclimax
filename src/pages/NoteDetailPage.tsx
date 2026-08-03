import React, { useState, useEffect, useRef } from 'react';
import { Book, Purchase } from '../types';
import { BkashPaymentModal } from '../components/BkashPaymentModal';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Download, Lock, CheckCircle2, ShieldCheck, Eye, Clock,
  BookOpen, Share2, Sparkles, User, ArrowLeft, FileText, Smartphone
} from 'lucide-react';

// PDF Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

// Auto 3 Page Preview Component
const AutoPdfPreview = ({ pdfUrl }: { pdfUrl: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!pdfUrl ||!containerRef.current) return;
    const render = async () => {
      setLoading(true);
      containerRef.current!.innerHTML = '';
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const pagesToShow = Math.min(pdf.numPages, 3);
        for (let i = 1; i <= pagesToShow; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.3 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "w-full rounded-xl shadow-md mb-4 bg-white";
          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            containerRef.current?.appendChild(canvas);
          }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    render();
  }, [pdfUrl]);
  return (
    <div className="relative border-2 border-dashed border-emerald-200 rounded-3xl p-3 bg-slate-50">
      {loading && <p className="p-8 text-center text-xs font-bold">PDF Preview লোড হচ্ছে...</p>}
      <div ref={containerRef} className="flex flex-col items-center"></div>
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none flex items-end justify-center pb-3">
        <span className="bg-slate-900 text-white text- px-4 py-1.5 rounded-full font-bold">৩ পেজ Preview শেষ - সম্পূর্ণ পড়তে Download করুন</span>
      </div>
    </div>
  );
};

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
  slug, books, purchases, currentUser, onNavigate, onRecordPurchase, onIncrementViews,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);
  const book = books.find((b) => b.slug === slug);

  useEffect(() => { if (book?.id) onIncrementViews(book.id); }, [book?.id]);

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-['Hind_Siliguri']">নোটটি খুঁজে পাওয়া যায়নি</h2>
        <button onClick={() => onNavigate('/notes')} className="px-5 py-2.5 bg-[#0E6B4D] text-white font-bold rounded-xl text-xs">← সকল নোট তালিকায় ফিরে যান</button>
      </div>
    );
  }

  const isPurchased = purchases.some((p) => p.book_id === book.id);
  const canDownload = book.is_free || isPurchased;

  const handleDownloadClick = () => {
    if (!currentUser && book.is_free) { onNavigate('/login'); return; }
    if (!canDownload) { setShowPaymentModal(true); return; }
    window.open(book.pdf_url || "", '_blank');
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
      <button onClick={() => onNavigate('/notes')} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0E6B4D] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /><span>সকল নোটে ফিরে যান</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#0E6B4D] text-white">{book.class_label}</span>
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-[#0E6B4D]">{book.subject}</span>
          {book.chapter && <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">{book.chapter}</span>}
          {book.is_free? <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-white">১০০% ফ্রি PDF</span> : <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FFB400] text-[#0E6B4D]">৳{book.price} প্রিমিয়াম নোট</span>}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-snug font-['Hind_Siliguri']">{book.title}</h1>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">{book.description}</p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium border-t border-slate-100">
          <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-emerald-600" />{book.views || 0} বার পঠিত</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-500" />প্রকাশকাল: {new Date(book.created_at).toLocaleDateString('bn-BD')}</
