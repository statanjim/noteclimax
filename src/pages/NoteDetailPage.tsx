import React, { useState, useEffect, useRef } from 'react';
import { Book, Purchase } from '../types';
import { BkashPaymentModal } from '../components/BkashPaymentModal';
import { Download, ArrowLeft, FileText, BookOpen } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

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
          const viewport = page.getViewport({ scale: 1.2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "w-full shadow-lg rounded-xl mb-4 bg-white";
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
    <div className="relative">
      {loading && <p className="p-10 text-center text-xs">PDF Preview লোড হচ্ছে...</p>}
      <div ref={containerRef} className="flex flex-col items-center bg-slate-100 p-2 rounded-2xl border"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-4">
        <span className="bg-slate-900 text-white text-xs px-4 py-1.5 rounded-full">৩ পেজ Preview শেষ - Full PDF ডাউনলোড করুন</span>
      </div>
    </div>
  );
};

export const NoteDetailPage = ({ slug, books, purchases, currentUser, onNavigate, onRecordPurchase, onIncrementViews }: any) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const book = books.find((b: Book) => b.slug === slug);
  useEffect(() => { if (book?.id) onIncrementViews(book.id); }, [book?.id]);
  if (!book) return <div className="p-10 text-center">নোট পাওয়া যায়নি</div>;
  const isPurchased = purchases.some((p: Purchase) => p.book_id === book.id);
  const canDownload = book.is_free || isPurchased;

  const handleDownload = () => {
    if (!currentUser) { onNavigate('/login'); return; }
    if (!canDownload) { setShowPaymentModal(true); return; }
    window.open(book.pdf_url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <button onClick={() => onNavigate('/notes')} className="bg-white border px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> ফিরে যান</button>
      <div className="bg-white rounded-3xl p-6 border shadow-sm">
        <h1 className="text-3xl font-black">{book.title}</h1>
        <p className="text-sm text-slate-600 mt-2">{book.description}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-dashed border-emerald-300 p-4 space-y-4">
            <h3 className="font-bold flex gap-2 items-center"><FileText className="w-5 h-5 text-emerald-700"/> PDF থেকে Auto Preview (৩ পেজ)</h3>
            {book.pdf_url && <AutoPdfPreview pdfUrl={book.pdf_url} />}
            <button onClick={handleDownload} className="w-full py-3 bg-[#0E6B4D] text-white font-bold rounded-xl flex justify-center gap-2"><Download className="w-4 h-4"/> সম্পূর্ণ PDF ডাউনলোড করুন</button>
          </div>
          {book.content_html && book.content_html!== 'index.html' && (
            <div className="bg-white rounded-3xl p-6 border"><h3 className="font-bold flex gap-2 mb-3"><BookOpen className="w-5 h-5"/> বিস্তারিত</h3><div dangerouslySetInnerHTML={{ __html: book.content_html }} /></div>
          )}
        </div>
        <div className="lg:col-span-1 sticky top-28 bg-white rounded-3xl p-6 border-2 border-[#0E6B4D] text-center">
          <h3 className="font-bold">PDF ডাউনলোড</h3>
          <button onClick={handleDownload} className="w-full mt-4 py-3 bg-[#FFB400] font-black rounded-xl">ডাউনলোড করুন</button>
        </div>
      </div>
      {showPaymentModal && <BkashPaymentModal book={book} onClose={() => setShowPaymentModal(false)} onSuccess={(trxId: string, amount: number) => { onRecordPurchase(book.id, amount, trxId); setShowPaymentModal(false); }} />}
    </div>
  );
};
